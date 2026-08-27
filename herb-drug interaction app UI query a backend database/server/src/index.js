import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { interactionRouter } from './routes/interaction.js';
import { drugsRouter } from './routes/drugs.js';

const app = express();
const PORT = process.env.PORT || 3050;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('http://localhost:5173/');
});

app.use('/api/interaction', interactionRouter);
app.use('/api/drugs', drugsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
