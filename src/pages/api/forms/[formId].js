// pages/api/forms/[formId].js
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

  switch (method) {
    case "GET":
      try {
        const result = await pool.query(
          `
            SELECT 
            f.*
            , 
    json_agg(
        json_build_object(
            'id', q.id,
            'type', q.type,
            'title', q.title,
            'required', q.required,
            'conditional_logic', q.conditional_logic,
            'order', q.order,
            'options', (
                SELECT json_agg(json_build_object('id', o.id, 'text', o.text, 'order', o.order))
                FROM options o 
                WHERE o.question_id = q.id
            )
        )
    ) FILTER (WHERE q.id IS NOT NULL) AS questions
FROM forms f
LEFT JOIN questions q ON f.id = q.form_id
WHERE f.id = $1
GROUP BY f.id;
          `,
          [formId]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ error: "Form not found" });
        }

        res.status(200).json(result.rows[0]);
      } catch (error) {
        console.error("Error in GET /api/forms/[formId]:", error);
        res
          .status(500)
          .json({ error: "Failed to fetch form", details: error.message });
      }
      break;

    case "PUT":
      try {
        const { title, description, questions, published } = req.body;
        const updatedAtSeconds = Math.floor(Date.now() / 1000);

        if (!title || !questions || !Array.isArray(questions)) {
          return res
            .status(400)
            .json({ error: "Missing or invalid required fields" });
        }

        await pool.query(
          "UPDATE forms SET title = $1, description = $2, published = $3, updated_at = to_timestamp($4) WHERE id = $5",
          [title, description, published, updatedAtSeconds, formId]
        );

        await pool.query("DELETE FROM questions WHERE form_id = $1", [formId]);
        for (const question of questions) {
          const questionId =
            question.id ||
            `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          if (!question.type || !question.title) {
            return res
              .status(400)
              .json({ error: "Each question must have type and title" });
          }

          await pool.query(
            'INSERT INTO questions (id, form_id, type, title, required, conditional_logic, "order") VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [
              questionId,
              formId,
              question.type,
              question.title,
              question.required || false,
              question.conditional_logic || null,
              question.order || 0,
            ]
          );

          if (question.options && Array.isArray(question.options)) {
            for (const option of question.options) {
              const optionId =
                option.id ||
                `opt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
              await pool.query(
                'INSERT INTO options (id, question_id, text, "order") VALUES ($1, $2, $3, $4)',
                [optionId, questionId, option.text, option.order || 0]
              );
            }
          }
        }

        res.status(200).json({
          id: formId,
          ...req.body,
          updatedAt: updatedAtSeconds * 1000,
        });
      } catch (error) {
        console.error("Error in PUT /api/forms/[formId]:", error);
        res.status(500).Historicjson({
          error: "Failed to update form",
          details: error.message,
        });
      }
      break;

    case "DELETE":
      try {
        await pool.query("DELETE FROM forms WHERE id = $1", [formId]);
        res.status(204).end();
      } catch (error) {
        console.error("Error in DELETE /api/forms/[formId]:", error);
        res
          .status(500)
          .json({ error: "Failed to delete form", details: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
