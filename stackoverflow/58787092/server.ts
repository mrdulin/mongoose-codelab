import express from 'express';
import categories from './model';
import http from 'http';

const app = express();
app.get('/api/things', async (req, res) => {
  const items = await categories
    .find({ name: 'book' })
    .limit(10)
    .skip(0);
  res.json(items);
});

const server = http.createServer(app).listen(3000, () => {
  console.info('Http server is listening on http://localhost:3000');
});

export { server };
