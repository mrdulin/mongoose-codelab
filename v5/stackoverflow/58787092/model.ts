import { model, Schema } from 'mongoose';

const modelName = 'category';

const categorySchema = new Schema(
  {
    name: String,
    parent: { type: Schema.Types.ObjectId, ref: modelName },
    slug: { type: String },
    ancestors: [{ _id: { type: Schema.Types.ObjectId, ref: modelName }, name: String, slug: String }],
  },
  {
    collection: 'category-hierarchy_categories',
  },
);

const categories = model(modelName, categorySchema);

export default categories;
