import { model, Schema } from 'mongoose';

const ProductSchema = new Schema(
  {
    id: Schema.Types.ObjectId,
    name: String
  },
  {
    collection: 'products'
  }
);

const Product = model('Product', ProductSchema);

const CategorySchema = new Schema(
  {
    id: Schema.Types.ObjectId,
    name: String
  },
  {
    collection: 'categories'
  }
);

const Category = model('Category', CategorySchema);

const ProductCategorySchema = new Schema(
  {
    id: Schema.Types.ObjectId,
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' }
  },
  {
    collection: 'product_category'
  }
);

const ProductCategory = model('ProductCategory', ProductCategorySchema);

export { Product, Category, ProductCategory };
