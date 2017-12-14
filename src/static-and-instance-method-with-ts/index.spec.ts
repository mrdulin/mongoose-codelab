import { expect } from 'chai';
import { User } from '.';

describe('Mongoose Static and instance method test suites', () => {
  it('instance method - comparePassword', () => {
    const user = new User({ email: '123@qq.com', name: 'qq', password: '123' });
    expect(user.comparePassword('321')).to.be.false;
  });

  it('static method - hashPassword', () => {
    const password: string = '123';
    const hashPassword = User.hashPassword(password);
    expect(Buffer.from(hashPassword, 'base64').toString()).to.eql(password);
  });
});
