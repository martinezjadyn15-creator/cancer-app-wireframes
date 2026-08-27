import { Router } from 'express';
import { pool } from '../db.js';

export const drugsRouter = Router();

drugsRouter.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT name FROM drugs ORDER BY name');
    res.json(rows.map((r) => r.name));
  } catch (err) {
    next(err);
  }
});
