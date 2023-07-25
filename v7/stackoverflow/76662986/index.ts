import { Schema } from 'mongoose';

interface Item {
	name?: string;
}
const itemSchema = new Schema<Item>({
	name: String,
});

interface Shop {
	items: Item[];
}

const shopSchema = new Schema<Shop>(
	{
		items: {
			type: [itemSchema],
			required: true,
		},
	},
	{
		virtuals: {
			isFull: {
				// get(): boolean {
				// 	return this.items.length > 15;
				// },
				get(this: Shop): boolean {
					return this.items.length > 15;
				},
			},
		},
	},
);
