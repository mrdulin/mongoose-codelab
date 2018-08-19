import { model, Schema } from 'mongoose';

const collectionNamePrefix = 'M-N_demo-3';

const ProductSchema = new Schema(
  {
    name: String,
    categoryIds: [Schema.Types.ObjectId]
  },
  {
    collection: `${collectionNamePrefix}_products`
  }
);

const Product = model('Product', ProductSchema);

const CategorySchema = new Schema(
  {
    name: String
  },
  {
    collection: `${collectionNamePrefix}_categories`
  }
);

const Category = model('Category', CategorySchema);

export { Product, Category, collectionNamePrefix };
