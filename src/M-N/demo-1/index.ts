import { Product, Category, ProductCategory } from './model';
import { logger } from '../../util';

export async function getProductWithCategories(id: string) {
  const product = await Product.findById(id).exec();
  const ProductCategoryList = await ProductCategory.find({ productId: id });
  const categories = await Category.find({ _id: { $in: ProductCategoryList.map((el: any) => el.categoryId) } }).exec();
  return { product, categories };
}
