import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, Fields, Files, File as FormidableFile } from 'formidable';
import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

const client = new Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PSSW,
  port: 5432,
});

client.connect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
      multiples: false,
    });

    form.parse(req, async (err: any, fields: Fields, files: Files) => {
      if (err) {
        console.error('Form parse error:', err);
        return res.status(500).json({ error: 'Error parsing the form data' });
      }

      const fileField = files.item_image as FormidableFile | FormidableFile[] | undefined;
      let file: FormidableFile | undefined;
      if (fileField) {
        file = Array.isArray(fileField) ? fileField[0] : fileField;
      }

      let itemImagePath = '';
      if (file) {
        const fileName = `${Date.now()}-${file.originalFilename}`;
        const newFilePath = path.join(uploadDir, fileName);

        const imageBuffer = await fs.promises.readFile(file.filepath);
        const processedImage = await sharp(imageBuffer)
          .resize({ width: 500, height: 500, fit: 'cover' })
          .toFormat('webp')
          .toBuffer();

        await fs.promises.writeFile(newFilePath.replace(/\.[^/.]+$/, ".webp"), processedImage);
        itemImagePath = `/uploads/${fileName.replace(/\.[^/.]+$/, ".webp")}`;

        fs.unlinkSync(file.filepath);
      }

      const {
        item_name,
        item_description,
        total_items,
        storage_quantity,
        lent_out_count,
        missing_count,
      } = fields;

      if (Number(storage_quantity) < 0 || Number(lent_out_count) < 0 || Number(missing_count) < 0) {
        return res.status(400).json({ error: 'Storage Quantity, Lent Out Count, and Missing Count must be 0 or greater.' });
      }

      const totalCount = Number(storage_quantity) + Number(lent_out_count) + Number(missing_count);

      if (totalCount !== Number(total_items)) {
        return res.status(400).json({ error: `The sum of Storage Quantity, Lent Out Count, and Missing Count must equal Total Items.` });
      }

      const not_lent_out_count = Number(total_items) - Number(lent_out_count);

      const insertQuery = `
        INSERT INTO items (
          item_name,
          item_image,
          item_description,
          total_items,
          storage_quantity,
          lent_out_count,
          not_lent_out_count,
          missing_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
      `;
      const values = [
        item_name?.[0]?.replace(/[{}"]/g, '') || '',
        itemImagePath,
        item_description?.[0]?.replace(/[{}"]/g, '') || '',
        Number(total_items),
        Number(storage_quantity),
        Number(lent_out_count),
        not_lent_out_count,
        Number(missing_count),
      ];

      client
        .query(insertQuery, values)
        .then(result => res.status(201).json(result.rows[0]))
        .catch(dbError => {
          console.error('Database insert error:', dbError);
          res.status(500).json({ error: 'Database insertion error' });
        });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
