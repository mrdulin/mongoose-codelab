import { Category } from './model';
import { logger } from '../util';

/**
 * 根据slug获取分类，由于分类内嵌了ancestors分类的id和slug，通过一次查询就可以满足生成分类breadcrumb展示的需求
 * @param slug 分类的slug
 */
export async function getCategoryBySlug(slug: string) {
  return Category.findOne({ slug });
}

/**
 * 插入新的分类时，构建分类的ancestors
 * @param id 当前分类id
 * @param parent 父级分类id
 */
export async function buildAncestors(id: string, parent: any) {
  const parentDoc: any = await Category.findOne({ _id: parent }, { name: 1, slug: 1, ancestors: 1 });
  const ancestors = parentDoc.ancestors.concat({ _id: parent, name: parentDoc.name, slug: parentDoc.slug });
  return Category.findOneAndUpdate({ _id: id }, { $set: { ancestors } }, { new: true });
}

/**
 * 创建新的分类, 并更新该分类的ancestors
 * @param doc 新的分类文档对象
 */
export async function createNewCategory(doc: any) {
  const category: any = await Category.create(doc);
  return buildAncestors(category._id, doc.parent);
}

export async function buildAllAncestors(id: string, parent: string) {
  const ancestors: any[] = [];

  while (parent) {
    const parentCat: any = await Category.findOne({ _id: parent });
    parent = parentCat.parent;
    ancestors.push({ _id: parent ? parent : parentCat._id, name: parentCat.name, slug: parentCat.slug });
  }
  return Category.update({ _id: id }, { $set: { ancestors } });
}

/**
 * 更改分类所属的上级分类
 * @param id 当前分类id
 * @param parent 上级分类id
 */
export async function changeAncestryOfCategory(id: string, parent: string) {
  try {
    const parentCat: any = await Category.findOne({ _id: parent }, { name: 1, slug: 1 });
    await Category.update(
      { _id: id },
      {
        $set: { parent },
        $push: { ancestors: { _id: parent, name: parentCat.name, slug: parentCat.slug } },
      },
    );

    const descendants: any[] = await Category.find({ 'ancestors._id': id });

    await Promise.all(
      descendants.map((cat) => {
        return buildAllAncestors(cat._id, cat.parent);
      }),
    );
  } catch (err) {
    logger.error(err);
  }
}
