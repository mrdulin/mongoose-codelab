import { expect } from 'chai';

import { getLeaves, metaDatas } from './seed';
import { logger } from '../util';

describe('seed test suites', () => {
  describe('getLeaves', () => {
    it('should return correctly datas', () => {
      const actualValue = getLeaves(metaDatas);
      logger.info(actualValue);

      expect(actualValue).to.be.have.lengthOf(5);
      const modalJazz = actualValue.find((node: any) => node.slug === 'modal-jazz');
      expect(modalJazz.parent).to.be.deep.equal(metaDatas.children[0]._id);
      expect(modalJazz.ancestors.map((ancestor: any) => ancestor._id)).to.be.deep.equal([
        metaDatas._id,
        metaDatas.children[0]._id
      ]);
    });
  });
});
