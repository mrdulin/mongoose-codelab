import { Document, Schema, Model, model } from 'mongoose';
import { logger } from '../util';

export interface IUserDocument extends Document {
  email: string;
  name: string;
  password: string;
}

export interface IUser extends IUserDocument {
  comparePassword(password: string): boolean;
}

export interface IUserModel extends Model<IUser> {
  hashPassword(password: string): string;
}

const userSchema: Schema = new Schema({
  email: { type: String, index: { unique: true }, require: true },
  name: { type: String, index: { unique: true }, required: true },
  password: { type: String, required: true }
});

userSchema.method('comparePassword', function comparePassword(this: IUser, password: string): boolean {
  logger.info(`this.password: ${this.password}`);
  return this.password === password;
});

userSchema.static('hashPassword', function hashPassword(password: string): string {
  return Buffer.from(password).toString('base64');
});

export const User: IUserModel = model<IUser, IUserModel>('User', userSchema);
