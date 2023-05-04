import express from 'express';
import mongoose from 'mongoose';
import { config } from '../../src/config';
import { FormMetaModel } from './models/form';

const app = express();

app.use(express.json());
app.put('/formMeta/:id', async (req, res) => {
  const { id } = req.params;
  const { fieldName, fieldType } = req.body;
  await FormMetaModel.updateOne({ _id: id }, { [fieldName]: fieldType });
  res.status(200).json({ code: '0', message: null, result: true });
});


app.get('/formMeta/:id', async (req, res) => {
  const { id } = req.params;
  const formDocument = await FormMetaModel.findById(id);
  res.status(200).json({ code: '0', message: null, result: formDocument });
})

app.post('/formMeta', async (req, res) => {
  const { fields } = req.body;
  const obj = fields.reduce((acc, cur) => {
    acc[cur.fieldName] = cur.fieldType;
    return acc;
  }, {})
  const formMeta = new FormMetaModel(obj);
  const formMetaDoc = await formMeta.save();
  res.status(200).json({ code: '0', message: null, result: formMetaDoc._id })
})


mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  app.listen(3000, () => console.log('server is listening port 3000'));
});