import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';

const client = new Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PSSW,
  port: 5432,
});

client.connect();

async function ensureTableExists() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      item_name VARCHAR(255) NOT NULL,
      item_image VARCHAR(255),
      item_description TEXT,
      total_items INTEGER NOT NULL,
      storage_quantity INTEGER DEFAULT 0,
      lent_out_count INTEGER DEFAULT 0,
      not_lent_out_count INTEGER DEFAULT 0,
      missing_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await client.query(createTableQuery);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await ensureTableExists();

    if (req.method === 'GET') {
      const result = await client.query('SELECT * FROM items ORDER BY item_name ASC');
      res.status(200).json(result.rows);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in /api/items handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
