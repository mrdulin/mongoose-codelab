import express from 'express';
import Post from './models/post';
import http from 'http';

const app = express();
app.post('/addPost', async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.sendStatus(200);
});

const server = http.createServer(app).listen(3000, () => {
  console.info('Http server is listening on http://localhost:3000');
});

export { server };
