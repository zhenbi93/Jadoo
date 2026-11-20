import express from 'express';
import { env } from './env.js';

const app = express();
app.disable('x-powered-by');
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.listen(env.PORT, '127.0.0.1', () => {
  console.log(`Travel Notebook API listening at http://127.0.0.1:${env.PORT}`);
});
