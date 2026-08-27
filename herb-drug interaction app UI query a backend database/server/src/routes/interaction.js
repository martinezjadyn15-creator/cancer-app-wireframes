import { Router } from 'express';
import { pool } from '../db.js';

export const interactionRouter = Router();

interactionRouter.get('/', async (req, res, next) => {
  try {
    const drug = (req.query.drug || '').trim();

    if (!drug) {
      return res.status(400).json({ error: 'drug query param is required' });
    }

    const { rows } = await pool.query(
      `SELECT
         name AS drug_name,
         drug_class,
         route,
         cancer_context,
         risk_level,
         mechanism_category,
         mechanism_note
       FROM drugs
       WHERE lower(name) = lower($1)
       LIMIT 1`,
      [drug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: `No interaction data for ${drug}` });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});
