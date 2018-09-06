import { Types } from 'mongoose';
import * as casual from 'casual';
import * as _ from 'lodash';

import { init } from '../../db';
import { User, Book, BookTemplate, BookResult } from './models';

const orgId: Types.ObjectId = Types.ObjectId();
const bookTemplateId: Types.ObjectId = Types.ObjectId();
const bookTemplateId2: Types.ObjectId = Types.ObjectId();
const bookId: Types.ObjectId = Types.ObjectId();

async function main(): Promise<any> {
  const datas = {
    users: [{ orgId, name: casual.name }, { orgId: Types.ObjectId(), name: casual.name }],
    bookTemplates: [
      { _id: bookTemplateId, orgId, title: casual.title },
      { _id: bookTemplateId2, orgId, name: casual.title },
      { orgId: Types.ObjectId(), name: casual.title }
    ],
    books: [
      { _id: bookId, bookTemplateId, title: casual.title },
      { _id: Types.ObjectId(), bookTemplateId, title: casual.title },
      { bookTemplateId: bookTemplateId2, title: casual.title },
      { bookTemplateId: Types.ObjectId(), title: casual.title }
    ],
    bookResults: [{ bookId, clicks: 100 }, { bookId: Types.ObjectId(), clicks: 200 }]
  };

  return Promise.all([
    init(datas.users, User, 'User', false),
    init(datas.bookTemplates, BookTemplate, 'BookTemplate', false),
    init(datas.books, Book, 'Book', false),
    init(datas.bookResults, BookResult, 'BookResult', false)
  ]);
}

export { main, orgId, bookTemplateId, bookId, bookTemplateId2 };
