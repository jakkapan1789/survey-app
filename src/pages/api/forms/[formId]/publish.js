// pages/api/forms/[formId]/publish.js
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // ใช้ตัวแปร env
  ssl: {
    rejectUnauthorized: false, // สำหรับ Render หรือ Heroku ที่ต้องการ SSL
  },
});

export default async function handler(req, res) {
  const { formId } = req.query;
  const { method } = req;

  console.log("Request Method:", method);
  console.log("Form ID:", formId);
  console.log("Request Body:", req.body);

  if (method === "PUT") {
    try {
      const { published } = req.body;
      const updatedAtSeconds = Math.floor(Date.now() / 1000);

      await pool.query(
        "UPDATE forms SET published = $1, updated_at = to_timestamp($2) WHERE id = $3",
        [published, updatedAtSeconds, formId]
      );
      res
        .status(200)
        .json({ id: formId, published, updatedAt: updatedAtSeconds * 1000 });
    } catch (error) {
      console.error("Error in PUT /api/forms/[formId]/publish:", error);
      res
        .status(500)
        .json({
          error: "Failed to update publish status",
          details: error.message,
        });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
