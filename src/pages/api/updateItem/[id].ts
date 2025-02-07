import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";
import { IncomingForm } from "formidable";
import fs from "fs";
import sharp from "sharp";
import path from "path";

const client = new Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PSSW,
  port: 5432,
});

client.connect();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "PATCH") {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: "Error parsing the files." });
        return;
      }

      const updateQuery = `
        UPDATE items 
        SET 
          item_name = COALESCE($1, item_name),
          item_description = COALESCE($2, item_description),
          total_items = COALESCE($3, total_items),
          storage_quantity = COALESCE($4, storage_quantity),
          lent_out_count = COALESCE($5, lent_out_count),
          missing_count = COALESCE($6, missing_count),
          item_image = COALESCE($7, item_image)
        WHERE id = $8
      `;

      let itemImagePath = null;

      const currentItem = await client.query(
        'SELECT item_image FROM items WHERE id = $1',
        [id]
      );
      const oldImagePath = currentItem.rows[0]?.item_image;

      
      if (files.itemImage) {
        const file = files.itemImage[0];
        const uploadDir = path.join(process.cwd(), "public/uploads");
        const fileName = `${Date.now()}-${file.originalFilename}`;
        const newFilePath = path.join(uploadDir, fileName);

        const imageBuffer = await fs.promises.readFile(file.filepath);
        const processedImage = await sharp(imageBuffer)
          .resize({ width: 500, height: 500, fit: "cover" })
          .toFormat("webp")
          .toBuffer();

        const newWebpFilePath = newFilePath.replace(/\.[^/.]+$/, ".webp");
        await fs.promises.writeFile(newWebpFilePath, processedImage);
        itemImagePath = `/uploads/${fileName.replace(/\.[^/.]+$/, ".webp")}`;

        fs.unlinkSync(file.filepath);

        if (oldImagePath) {
          const oldImageFullPath = path.join(process.cwd(), "public", oldImagePath);
          if (fs.existsSync(oldImageFullPath)) {
            fs.unlinkSync(oldImageFullPath);
          }
        }
      }

      const values = [
        fields.itemName?.[0]?.replace(/[{}"]/g, "") || null,
        fields.itemDescription?.[0]?.replace(/[{}"]/g, "") || null,
        fields.totalItems ? Number(fields.totalItems[0]) : null,
        fields.storageQuantity ? Number(fields.storageQuantity[0]) : null,
        fields.lentOutCount ? Number(fields.lentOutCount[0]) : null,
        fields.missingCount ? Number(fields.missingCount[0]) : null,
        itemImagePath,
        id,
      ];

      await client.query(updateQuery, values);
      res.status(200).json({ message: "Item updated successfully." });
    });
  } else {
    res.setHeader("Allow", ["PATCH"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
