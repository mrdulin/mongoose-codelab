import { Schema, model, Document, Model } from 'mongoose';

const {
  Types: { ObjectId },
} = Schema;

export interface CatalogTypeDocument extends Document {
  _id: number;
  code: string;
  description: string;
  version: number;
}

export interface CatalogTypeModel extends Model<CatalogTypeDocument> {}

export const schema = new Schema<CatalogTypeDocument>({
  id: {
    type: ObjectId,
  },
  code: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  version: {
    type: Number,
    required: false,
  },
});

export const CatalogTypeModel = model<CatalogTypeDocument, CatalogTypeModel>('Catalog', schema);
