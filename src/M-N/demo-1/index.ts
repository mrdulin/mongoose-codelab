import { Product, Category, ProductCategory } from './model';
import { logger } from '../../util';

/**
 * 获取商品及其所属的分类
 *
 * TODO: 尝试使用aggregate的lookup一次查询出
 * @param id
 */
export async function getProductWithCategories(id: string) {
  const product = await Product.findById(id).exec();
  const ProductCategoryList = await ProductCategory.find({ productId: id });
  const categories = await Category.find({ _id: { $in: ProductCategoryList.map((el: any) => el.categoryId) } }).exec();
  return { product, categories };
}

// TODO: 获取包含产品的分类
