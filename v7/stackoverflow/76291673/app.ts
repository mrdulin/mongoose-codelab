import mongoose from 'mongoose';
import express from 'express';
import multer from 'multer';
import path from 'path';
import { Buffer } from 'node:buffer';
import { config } from '../../config';

const imageSchema = new mongoose.Schema({
  file: {
    data: String,
  }
})
const ImageModel = mongoose.model('images', imageSchema);

mongoose.connect(config.MONGODB_URI).then(() => console.log('Connect mongodb successfully')).catch(console.error)

const app = express();
const upload = multer()


app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})
app.get('/healthcheck', (req, res) => {
  res.sendStatus(200);
})

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.sendStatus(400);
  const image = new ImageModel({
    file: {
      data: req.file.buffer.toString('base64'),
      // data: Buffer.from(req.file.buffer, 'base64')
    }
  })
  await image.save();
  res.sendStatus(200);
})
app.get('/image/:id', async (req, res) => {
  const image = await ImageModel.findById(req.params.id).lean();
  if (!image) return res.sendStatus(404);
  res.status(200).json(image);
})

app.listen(3000, () => console.log('listening on http://localhost:3000'))
