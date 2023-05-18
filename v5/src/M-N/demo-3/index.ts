import { Product, Category } from './models';

export async function getProductWithCategories(id: string) {
  const product: any = await Product.findById(id).exec();
  let categories: any[] = [];
  if (product) {
    categories = await Category.find({ _id: { $in: product.categoryIds } }).exec();
  }

  return { product, categories };
}

// https://stackoverflow.com/questions/18148166/find-document-with-array-that-contains-a-specific-value
export async function getProductsByCategoryId(id: string) {
  const products: any[] = await Product.find({ categoryIds: id });
  return products;
}
