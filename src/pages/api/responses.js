// pages/api/responses.js
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // ใช้ตัวแปร env
  ssl: {
    rejectUnauthorized: false, // สำหรับ Render หรือ Heroku ที่ต้องการ SSL
  },
});

export default async function handler(req, res) {
  const { method } = req;
  const { formId } = req.query;

  console.log("Request Method:", method);
  console.log("Request Body:", req.body);

  switch (method) {
    // case "GET":
    //   try {
    //     const result = await pool.query(`
    //         SELECT r.*,
    //                json_agg(json_build_object('questionId', a.question_id, 'value', a.value)) AS answers
    //         FROM responses r
    //         JOIN answers a ON r.id = a.response_id
    //         GROUP BY r.id
    //       `);
    //     res.status(200).json(result.rows);
    //   } catch (error) {
    //     console.error("Error fetching responses:", error);
    //     res
    //       .status(500)
    //       .json({ error: "Failed to fetch responses", details: error.message });
    //   }
    //   break;
    case "GET":
      try {
        let query = `
          SELECT r.*, 
                 json_agg(json_build_object('questionId', a.question_id, 'value', a.value)) AS answers
          FROM responses r
          JOIN answers a ON r.id = a.response_id
        `;
        const params = [];

        // ถ้ามี formId ให้กรอง
        if (formId) {
          query += " WHERE r.form_id = $1";
          params.push(formId);
        }

        query += " GROUP BY r.id";

        const result = await pool.query(query, params);
        res.status(200).json(result.rows);
      } catch (error) {
        console.error("Error fetching responses:", error);
        res
          .status(500)
          .json({ error: "Failed to fetch responses", details: error.message });
      }
      break;

    case "POST":
      try {
        const { id, formId, answers, createdAt } = req.body;

        if (!id || !formId || !answers || !Array.isArray(answers)) {
          return res
            .status(400)
            .json({ error: "Missing or invalid required fields" });
        }

        const createdAtSeconds = Math.floor(Number(createdAt) / 1000);

        console.log("Inserting response:", {
          id,
          formId,
          createdAt: createdAtSeconds,
        });
        await pool.query(
          "INSERT INTO responses (id, form_id, created_at) VALUES ($1, $2, to_timestamp($3))",
          [id, formId, createdAtSeconds]
        );

        console.log("Inserting answers:", answers);
        for (const answer of answers) {
          const answerId = `ans-${Date.now()}-${Math.floor(
            Math.random() * 1000
          )}`;
          const value = Array.isArray(answer.value)
            ? JSON.stringify(answer.value)
            : answer.value;
          await pool.query(
            "INSERT INTO answers (id, response_id, question_id, value) VALUES ($1, $2, $3, $4)",
            [answerId, id, answer.questionId, value]
          );
        }

        res.status(201).json({ ...req.body });
      } catch (error) {
        console.error("Error in POST /api/responses:", error);
        res
          .status(500)
          .json({ error: "Failed to submit response", details: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
