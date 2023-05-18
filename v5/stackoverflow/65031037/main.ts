import { IUser, User } from './user';

async function main() {
  const email = 'teresa.teng@gmail.com';
  const password = '123';
  const user: IUser | null = await User.findOne({ email }).exec();
  if (!user) {
    return;
  }
  user.isValidPassword(password);
}
