import { expect } from 'chai';
import mongoose from 'mongoose';
import _ from 'lodash';
import * as seed from './init';
import { init, MongoConnect } from '../../db';
import { Product, Category, ProductCategory } from './model';
import { getProductWithCategories } from '.';

let conn: mongoose.Mongoose | undefined;
let datas: any;
before(async () => {
  datas = seed.main();
  conn = await MongoConnect();
  await Promise.all([
    init(datas.products, Product, 'Product', false),
    init(datas.categories, Category, 'Category', false),
    init(datas.productCategory, ProductCategory, 'ProductCategory', false),
  ]);
});

after(async () => {
  if (conn) {
    await conn.disconnect();
  }
});

describe('M-N demo-1 test suites', () => {
  it('initial datas should correct', () => {
    expect(datas.products).to.have.lengthOf(seed.metaDatas.product.count);
    expect(datas.categories).to.be.have.lengthOf(seed.metaDatas.product.categoryCount * seed.metaDatas.product.count);
    expect(datas.productCategory).to.be.have.lengthOf(
      seed.metaDatas.product.categoryCount * seed.metaDatas.product.count,
    );
  });

  it('should get product with categories correctly', async () => {
    const { _id: productId }: any = _.chain(datas.products)
      .first()
      .pick('_id')
      .value();
    // logger.info(productId);
    const { product, categories } = await getProductWithCategories(productId);
    expect(categories).to.be.have.lengthOf(seed.metaDatas.product.categoryCount);
  });
});
