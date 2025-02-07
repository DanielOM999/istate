const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PSSW,
  port: 5432,
});

const defaultItems = [
  {
    item_image: "https://cdn-icons-png.flaticon.com/512/689/689355.png",
    item_name: "Laptop",
    item_description: "Portable computers for student and staff use.",
    total_items: 150,
    storage_quantity: 100,
    lent_out_count: 40,
    missing_count: 10,
  },
  {
    item_image: null,
    item_name: "Tablet",
    item_description: "Touchscreen devices for interactive learning.",
    total_items: 80,
    storage_quantity: 50,
    lent_out_count: 25,
    missing_count: 5,
  },
  {
    item_image: "https://cdn-icons-png.flaticon.com/512/1064/1064593.png",
    item_name: "Projector",
    item_description: "Devices for displaying content to large audiences.",
    total_items: 20,
    storage_quantity: 15,
    lent_out_count: 5,
    missing_count: 0,
  },
  {
    item_image: "https://cdn-icons-png.flaticon.com/512/3233/3233468.png",
    item_name: "Printer",
    item_description: "Machines for producing hard copies of documents.",
    total_items: 10,
    storage_quantity: 8,
    lent_out_count: 2,
    missing_count: 0,
  },
  {
    item_image: "https://cdn-icons-png.flaticon.com/512/1183/1183606.png",
    item_name: "Router",
    item_description: "Equipment for managing network traffic.",
    total_items: 10,
    storage_quantity: 7,
    lent_out_count: 3,
    missing_count: 0,
  },
  {
    item_image: "https://cdn-icons-png.flaticon.com/512/2248/2248677.png",
    item_name: "Network Switch",
    item_description: "Devices for connecting multiple network devices.",
    total_items: 8,
    storage_quantity: 6,
    lent_out_count: 2,
    missing_count: 0,
  },
  {
    item_image: "https://cdn-icons-png.flaticon.com/512/2906/2906274.png",
    item_name: "Server",
    item_description:
      "High-performance computers for hosting applications and data.",
    total_items: 5,
    storage_quantity: 3,
    lent_out_count: 2,
    missing_count: 0,
  },
  {
    item_image: "https://cdn-icons-png.flaticon.com/512/6190/6190871.png",
    item_name: "Headphones",
    item_description: "Audio devices for personal listening.",
    total_items: 200,
    storage_quantity: 150,
    lent_out_count: 40,
    missing_count: 10,
  },
  {
    item_image: "https://cdn-icons-png.flaticon.com/512/2168/2168463.png",
    item_name: "Microphone",
    item_description: "Devices for audio recording and amplification.",
    total_items: 15,
    storage_quantity: 10,
    lent_out_count: 5,
    missing_count: 0,
  },
  {
    item_image: "https://cdn-icons-png.flaticon.com/512/1537/1537584.png",
    item_name: "External Hard Drive",
    item_description: "Portable storage devices for data backup.",
    total_items: 25,
    storage_quantity: 20,
    lent_out_count: 5,
    missing_count: 0,
  },
  {
    item_image: "https://cdn-icons-png.flaticon.com/512/2015/2015064.png",
    item_name: "USB Flash Drive",
    item_description: "Compact devices for transferring data.",
    total_items: 100,
    storage_quantity: 80,
    lent_out_count: 15,
    missing_count: 5,
  },
];

async function insertDefaultItems() {
  try {
    await client.connect();
    console.log("Connected to the database.");

    for (const item of defaultItems) {
      const query = `
        INSERT INTO items (item_image, item_name, item_description, total_items, storage_quantity, lent_out_count, missing_count)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      const values = [
        item.item_image,
        item.item_name,
        item.item_description,
        item.total_items,
        item.storage_quantity,
        item.lent_out_count,
        item.missing_count,
      ];
      await client.query(query, values);
    }

    console.log("Default items inserted successfully!");
  } catch (error) {
    console.error("Error inserting default items:", error);
  } finally {
    await client.end();
    console.log("Disconnected from the database.");
  }
}

insertDefaultItems();
