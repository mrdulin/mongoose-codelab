import mongoose from 'mongoose';

interface MyDocument {
	rating?: number;
	timestamp?: Date;
}
const MySchema = new mongoose.Schema<MyDocument>({
	rating: Number,
	timestamp: { type: Date, default: Date.now() },
});

const Model = mongoose.model<MyDocument>('model', MySchema);

const doc = new Model();
doc.rating; // ok
doc.timestamp; // ok
