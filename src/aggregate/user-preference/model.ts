import { Model, model, Schema, Document } from 'mongoose';

const MODEL_NAME = 'User';

interface IUserDocument extends Document {
  name: string;
  joined: Date;
  likes: string[];
}

interface IUser extends IUserDocument {
  test(): void;
}

interface IUserModel extends Model<IUser> {
  uppercaseAndSortByUsername(): Array<{ name: string }>;
  usernamesOrderedByJoinMonth(): IUsernamesOrderedByJoinMonth[];
  totalNumberOfJoinsPerMonth(): ITotalNumberOfJoinsPerMonthResponse[];
  topFiveLikes(): ITopFiveLikes[];
}

const userSchema = new Schema(
  {
    name: String,
    joined: { type: Date, default: Date.now() },
    likes: [String]
  },
  {
    collection: 'user-preference_users'
  }
);

async function uppercaseAndSortByUsername(this: IUserModel): Promise<Array<{ name: string }>> {
  return this.aggregate([
    {
      $project: {
        name: { $toUpper: '$name' },
        _id: 0
      }
    },
    { $sort: { name: 1 } }
  ]);
}

interface IUsernamesOrderedByJoinMonth {
  name: string;
  month_joined: number;
}

async function usernamesOrderedByJoinMonth(this: IUserModel): Promise<IUsernamesOrderedByJoinMonth[]> {
  return this.aggregate([
    {
      $project: { month_joined: { $month: '$joined' }, _id: 0, name: 1 }
    },
    {
      $sort: { month_joined: 1 }
    }
  ]);
}

interface ITotalNumberOfJoinsPerMonthResponse {
  _id: { month_joined: number };
  number: number;
}

async function totalNumberOfJoinsPerMonth(this: IUserModel): Promise<ITotalNumberOfJoinsPerMonthResponse[]> {
  return this.aggregate([
    {
      $project: { month_joined: { $month: '$joined' } }
    },
    {
      $group: { _id: { month_joined: '$month_joined' }, number: { $sum: 1 } }
    },
    {
      $sort: { number: 1, '_id.month_joined': 1 }
    }
  ]);
}

interface ITopFiveLikes {
  like: string;
  number: number;
}

async function topFiveLikes(this: IUserModel): Promise<ITopFiveLikes[]> {
  return this.aggregate([
    { $unwind: '$likes' },
    { $group: { _id: '$likes', number: { $sum: 1 } } },
    { $sort: { number: -1, _id: 1 } },
    { $limit: 5 }
  ]);
}

userSchema.static({
  uppercaseAndSortByUsername,
  usernamesOrderedByJoinMonth,
  totalNumberOfJoinsPerMonth,
  topFiveLikes
});

// 注意：model初始化一定要在static和method方法之后
const User: IUserModel = model<IUser, IUserModel>(MODEL_NAME, userSchema);

export {
  User,
  IUserDocument,
  MODEL_NAME,
  IUsernamesOrderedByJoinMonth,
  ITotalNumberOfJoinsPerMonthResponse,
  ITopFiveLikes
};
