import { expect } from 'chai';
import { Types, Mongoose } from 'mongoose';
import * as _ from 'lodash';

import * as seed from './seed';
import { init } from '../db';
import { logger } from '../util';
import { Category } from './model';
import { getCategoryBySlug, createNewCategory, changeAncestryOfCategory } from './';

let conn: Mongoose | undefined;
let datas: any;
before(async () => {
  datas = seed.main();
  conn = await init(datas, Category, 'Category');
});

after(async () => {
  if (conn) {
    await conn.disconnect();
  }
});

const findCategoryBySlug = (slug: string) => datas.find((data: any) => data.slug === slug);

describe('category-hierarchy test suites', () => {
  const childrenSlugs: string[] = seed.metaDatas.children[0].children.map((cat: any) => cat.slug);

  it('should initialize categories collection correcly', async () => {
    const categories = await Category.find({}).exec();
    expect(categories).to.be.have.lengthOf(5);

    const ancestors = datas
      .filter((data: any) => !childrenSlugs.includes(data.slug))
      .map((data: any, idx: number) => data._id);

    childrenSlugs.forEach((slug: string) => {
      const cat = findCategoryBySlug(slug);
      expect(cat.ancestors.map((ancestor: any) => ancestor._id)).to.be.deep.equal(ancestors);
    });
  });

  it('getCategoryBySlug', async () => {
    const slug = 'modal-jazz';
    const category: any = await getCategoryBySlug(slug);
    expect(category.slug).to.be.equal(slug);
  });

  it('createNewCategory - create swing category which is a descendant of category ragtime, siblings of category bop', async () => {
    const ragtime: any = datas.find((data: any) => data.slug === 'ragtime');
    const doc = { name: 'Swing', slug: 'swing', parent: ragtime._id };
    const category: any = ((await createNewCategory(doc)) as any).toObject();
    expect(category.name).to.be.eql(doc.name);
    expect(category.parent).to.be.deep.equal(ragtime._id);
    expect(category.ancestors).to.be.deep.equal([{ _id: doc.parent, name: ragtime.name, slug: ragtime.slug }]);
  });

  it('changeAncestryOfCategory - change swing category to be a descendant of ragtime, parent of bop', async () => {
    const swing: any = await getCategoryBySlug('swing');
    const bop: any = await getCategoryBySlug('bop');
    await changeAncestryOfCategory(bop._id, swing._id);

    const newSwing: any = ((await getCategoryBySlug('swing')) as any).toObject();
    expect(newSwing.parent).to.be.deep.equal(seed.metaDatas._id);
    expect(newSwing.ancestors).to.be.deep.equal([
      { _id: seed.metaDatas._id, name: seed.metaDatas.name, slug: seed.metaDatas.slug }
    ]);

    const results = await Promise.all(childrenSlugs.map((slug: string) => getCategoryBySlug(slug)));

    const ancestorsArray = results.map((cat: any) => {
      return cat.toObject().ancestors.map((ancestor: any) => {
        return ancestor._id.toString();
      });
    });

    // TODO: mongoose id与_id，和之间的比较
    const ancestors = await Promise.all(['ragtime', 'swing', 'bop'].map((slug: string) => getCategoryBySlug(slug)));
    expect(ancestorsArray).to.be.deep.equal(
      _.fill(Array(3), ancestors.map((ancestor: any) => ancestor._id.toString()))
    );
  });
});
