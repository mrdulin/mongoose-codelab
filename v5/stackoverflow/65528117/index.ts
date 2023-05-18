import { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const salt: number = 12;

const UserSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 32,
  },
  password: {
    type: String,
    required: true,
  },
});

// * Hash the password befor it is beeing saved to the database
UserSchema.pre('save', function (this: IUser, next: (err?: Error | undefined) => void) {
  // * Make sure you don't hash the hash
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.hash(this.password, salt, (err: Error, hash: string) => {
    if (err) return next(err);
    this.password = hash;
  });
});

UserSchema.methods.comparePasswords = function (
  candidatePassword: string,
  next: (err: Error | null, same: boolean | null) => void,
) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return next(err, null);
    }
    next(null, isMatch);
  });
};

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  comparePasswords(candidatePassword: string, next: (err: Error | null, same: boolean | null) => void): void;
}
