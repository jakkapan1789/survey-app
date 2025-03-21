// pages/api/forms.js (สำหรับ Next.js API Routes)
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // ใช้ตัวแปร env
  ssl: {
    rejectUnauthorized: false, // สำหรับ Render หรือ Heroku ที่ต้องการ SSL
  },
});

export default async function handler(req, res) {
  const { method } = req;

  console.log("Request Method:", method);
  console.log("Request Body:", req.body);

  switch (method) {
    case "GET":
      try {
        const result = await pool.query(`
            SELECT f.*
            , 
                   json_agg(json_build_object(
                     'id', q.id,
                     'type', q.type,
                     'title', q.title,
                     'required', q.required,
                     'conditional_logic', q.conditional_logic,
                     'order', q.order,
                     'options', (
                       SELECT json_agg(json_build_object('id', o.id, 'text', o.text, 'order', o.order))
                       FROM options o WHERE o.question_id = q.id
                     )
                   )) AS questions
            FROM forms f
            LEFT JOIN questions q ON f.id = q.form_id
            GROUP BY f.id
          `);
        res.status(200).json(result.rows);
      } catch (error) {
        console.error("Error fetching forms:", error);
        res
          .status(500)
          .json({ error: "Failed to fetch forms", details: error.message });
      }
      break;

    case "POST":
      try {
        const {
          id,
          title,
          description,
          questions,
          created_at,
          updated_at,
          published,
        } = req.body;

        if (!id || !title || !questions || !Array.isArray(questions)) {
          return res
            .status(400)
            .json({ error: "Missing or invalid required fields" });
        }

        const createdAtSeconds = Math.floor(Number(created_at) / 1000);
        const updatedAtSeconds = Math.floor(Number(updated_at) / 1000);

        await pool.query(
          "INSERT INTO forms (id, title, description, published, created_at, updated_at) VALUES ($1, $2, $3, $4, to_timestamp($5), to_timestamp($6))",
          [
            id,
            title,
            description,
            published,
            createdAtSeconds,
            updatedAtSeconds,
          ]
        );

        console.log("Inserting questions:", questions);
        for (const question of questions) {
          await pool.query(
            // ใส่ "order" ในเครื่องหมายคำพูด
            'INSERT INTO questions (id, form_id, type, title, required, "order") VALUES ($1, $2, $3, $4, $5, $6)',
            [
              question.id,
              id,
              question.type,
              question.title,
              question.required,
              question.order || 0,
            ]
          );
        }

        res.status(201).json({ ...req.body });
      } catch (error) {
        console.error("Error in POST /api/forms:", error);
        res
          .status(500)
          .json({ error: "Failed to create form", details: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
