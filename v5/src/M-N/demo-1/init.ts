import * as casual from 'casual';
import { Types } from 'mongoose';

const metaDatas = {
  product: {
    count: 2,
    categoryCount: 3
  }
};

function main(meta: any = metaDatas) {
  const products = [];
  const categories = [];
  const productCategory = [];

  for (let i = 0; i < meta.product.count; i++) {
    const productId = Types.ObjectId();
    const product = { _id: productId, name: casual.word };
    products.push(product);

    for (let j = 0; j < meta.product.categoryCount; j++) {
      const categoryId = Types.ObjectId();
      categories.push({ _id: categoryId, name: casual.word });
      productCategory.push({ productId, categoryId });
    }
  }

  return { products, categories, productCategory };
}

export { main, metaDatas };
