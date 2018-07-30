import { Schema, Model, Document, model } from 'mongoose';

export interface INumStatic {
  add(): Promise<any[]>;
}

export interface INum extends Document, INumStatic {
  x: number;
  y: number;
  z: number;
}

const numSchema: Schema = new Schema(
  {
    x: Number,
    y: Number,
    z: Number
  },
  { collection: 'nums' }
);

export const Num: Model<INum> = model<INum>('Num', numSchema);

function add(): Promise<any[]> {
  return Num.aggregate(
    [
      {
        $project: {
          result: {
            $add: ['$x', '$y', '$z']
          }
        }
      }
    ],
    (err: any, results: any) => {
      if (err) {
        return console.log(err);
      }
      return results;
    }
  );
}

function subtract() {
  return Num.aggregate(
    [
      {
        $project: {
          result: {
            $subtract: ['$x', { $add: ['$y', '$z'] }]
          }
        }
      }
    ],
    (err: any, results: any[]) => {
      if (err) {
        return console.log(err);
      }
      return results;
    }
  );
}

numSchema.static({
  add,
  subtract
});
