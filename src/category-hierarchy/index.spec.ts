import { expect } from 'chai';
import { Types, Mongoose } from 'mongoose';
import * as _ from 'lodash';

import * as seed from './seed';
import { init } from '../db';
import { logger } from '../util';
import { Category } from './model';
import { getCategoryBySlug, createNewCategory } from './';

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

describe('category-hierarchy test suites', () => {
  it('should initialize categories collection correcly', async () => {
    const categories = await Category.find({}).exec();
    expect(categories).to.be.have.lengthOf(5);
  });

  it('getCategoryBySlug', async () => {
    const slug = 'modal-jazz';
    const category: any = await getCategoryBySlug(slug);
    expect(category.slug).to.be.equal(slug);
  });

  it('buildAncestors', async () => {
    const parent: string = datas.find((data: any) => data.slug === 'ragtime')._id;
    const doc = { name: 'Swing', slug: 'swing', parent };
    const category: any = ((await createNewCategory(doc)) as any).toObject();
    expect(category.name).to.be.eql(doc.name);
    expect(category.parent).to.be.deep.equal(parent);
    expect(category.ancestors).to.be.deep.equal([{ _id: doc.parent, name: doc.name, slug: doc.slug }]);
  });
});
