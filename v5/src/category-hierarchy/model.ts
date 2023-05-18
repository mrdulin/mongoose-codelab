import { model, Schema } from 'mongoose';

const modelName = 'Category';

const categorySchema = new Schema(
  {
    name: String,
    parent: { type: Schema.Types.ObjectId, ref: modelName },
    slug: { type: String },
    ancestors: [{ _id: { type: Schema.Types.ObjectId, ref: modelName }, name: String, slug: String }]
  },
  {
    collection: 'category-hierarchy_categories'
  }
);

const Category = model(modelName, categorySchema);

export { Category };
