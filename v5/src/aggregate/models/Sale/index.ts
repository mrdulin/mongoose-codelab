import { Schema, Model, Document, model } from 'mongoose';

export interface ISale extends Document {
  item: string;
  price: number;
  quantity: number;
  date: string;
}

const saleSchema: Schema = new Schema(
  {
    item: String,
    price: Number,
    quantity: Number,
    date: Date
  },
  { collection: 'sales' }
);

export const Sale: Model<ISale> = model<ISale>('sale', saleSchema);

// Calculate Count, Sum, and Average

function getAggregateDataByDate() {
  return Sale.aggregate(
    [
      {
        $group: {
          _id: { month: { $month: '$date' }, day: { $dayOfMonth: '$date' }, year: { $year: '$date' } },
          totalPrice: {
            $sum: {
              $multiply: ['$price', '$quantity']
            }
          },
          averageQuantity: { $avg: '$quantity' },
          count: { $sum: 1 }
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

function getTotalData() {
  return Sale.aggregate(
    [
      {
        $group: {
          _id: null,
          totalPrice: {
            $sum: {
              $multiply: ['$price', '$quantity']
            }
          },
          averageQuantity: { $avg: '$quantity' },
          count: { $sum: 1 }
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

saleSchema.static({ getAggregateDataByDate, getTotalData });
