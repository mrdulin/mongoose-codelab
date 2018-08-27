import { expect } from 'chai';
import * as mongoose from 'mongoose';
import * as _ from 'lodash';

import * as seed from './seed';
import { init, MongoConnect } from '../../db';
import { logger } from '../../util';
import { Product, Category } from './models';
import { getProductWithCategories, getProductsByCategoryId } from '.';

let conn: mongoose.Mongoose | undefined;
let datas: any;
before(async () => {
  datas = seed.main();
  conn = await MongoConnect();
  await Promise.all([
    init(datas.products, Product, 'Product', false),
    init(datas.categories, Category, 'Category', false)
  ]);
});

after(async () => {
  if (conn) {
    await conn.disconnect();
  }
});

describe('M-N demo-3 test suites', () => {
  describe('getProductWithCategories', () => {
    it('should return product and categories correctly', async () => {
      const firstProduct: any | undefined = _.first(datas.products);
      if (firstProduct) {
        const { product, categories } = await getProductWithCategories(firstProduct._id);
        expect({ _id: product._id, name: product.name }).to.be.deep.equal({
          _id: firstProduct._id,
          name: firstProduct.name
        });
        expect(categories).to.be.have.lengthOf(2);
      }
    });
  });

  describe('getProductsByCategoryId', () => {
    it('should return products correctly', async () => {
      const firstCategory: any | undefined = _.first(datas.categories);
      if (firstCategory) {
        const products: any[] = await getProductsByCategoryId(firstCategory._id);
        const expectProducts = datas.products
          .map((product: any) => (product.categoryIds.includes(firstCategory._id) ? product : null))
          .filter((v: any) => v);
        expect(products).to.have.lengthOf(expectProducts.length);
      }
    });
  });
});
