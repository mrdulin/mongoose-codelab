import { Category } from './model';
import { logger } from '../util';

export async function getCategoryBySlug(slug: string) {
  return Category.findOne({ slug }, { _id: 0, name: 1, slug: 1, 'ancestors.name': 1, 'ancestors.slug': 1 }).exec();
}

/**
 * 插入新的分类时，构建分类的ancestors
 * @param id 当前分类id
 * @param parentId 父级分类id
 */
export async function buildAncestors(id: string, doc: any) {
  const parent: any = await Category.findOne({ _id: doc.parent }, { name: 1, slug: 1, ancestors: 1 }).exec();
  const ancestors = parent.ancestors.concat({ _id: doc.parent, name: doc.name, slug: doc.slug });
  return Category.findOneAndUpdate({ _id: id }, { $set: { ancestors } }, { new: true }).exec();
}

export async function createNewCategory(doc: any) {
  const category: any = await Category.create(doc);
  return buildAncestors(category._id, doc);
}
