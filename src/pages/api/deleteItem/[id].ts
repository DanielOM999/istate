import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';


const client = new Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PSSW,
  port: 5432,
});

client.connect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const deleteQuery = 'DELETE FROM items WHERE id = $1 RETURNING *';
      const values = [id];
      const result = await client.query(deleteQuery, values);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }

      const deletedItem = result.rows[0];
      if (deletedItem.item_image) {
        const imagePath = path.join(process.cwd(), 'public', 'uploads', path.basename(deletedItem.item_image));
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Error deleting image:', err);
          }
        });
      }
      res.status(200).json({ message: 'Item deleted successfully', item: deletedItem });

    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
