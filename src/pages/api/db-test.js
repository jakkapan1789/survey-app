import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // ใช้ตัวแปร env
  ssl: {
    rejectUnauthorized: false, // สำหรับ Render หรือ Heroku ที่ต้องการ SSL
  },
});

export default async function handler(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()"); // ทดสอบ query
    client.release();

    res.status(200).json({ success: true, time: result.rows[0] });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
