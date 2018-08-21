import { model, Schema } from 'mongoose';

const modelName = 'Category';

const CategorySchema = new Schema(
  {
    name: String,
    parent: { type: Schema.Types.ObjectId, ref: modelName },
    slug: String,
    // ancestors: [{ id: { type: Schema.Types.ObjectId, ref: modelName }, name: String, slug: String }]
    ancestors: [{ _id: { type: Schema.Types.ObjectId, ref: modelName }, name: String, slug: String }]
  },
  {
    collection: 'category-hierarchy_categories'
  }
);

const Category = model(modelName, CategorySchema);

export { Category };
