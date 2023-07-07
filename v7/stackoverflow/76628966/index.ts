import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.set('debug', true);
console.log(mongoose.version);

const mediaSchema = new mongoose.Schema({
	image: String,
	eligible: Boolean,
});

const sectionSchema = new mongoose.Schema({
	sectionData: {
		media: [mediaSchema],
	},
});

const uploadAlbumSchema = new mongoose.Schema({
	sections: [sectionSchema],
});
const UploadAlbum = mongoose.model('upload_albums', uploadAlbumSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		// seed
		// await UploadAlbum.create([
		// 	{
		// 		sections: [
		// 			{ sectionData: { media: [{ image: '1.jpg' }, { image: '1.jpg' }, { image: '1.jpg' }, { image: '1.jpg' }] } },
		// 			{ sectionData: { media: [{ image: 'a.jpg' }, { image: 'a.jpg' }, { image: 'a.jpg' }, { image: 'a.jpg' }] } },
		// 		],
		// 	},
		// 	{
		// 		sections: [
		// 			{ sectionData: { media: [{ image: 'b.jpg' }, { image: 'b.jpg' }, { image: 'b.jpg' }, { image: 'b.jpg' }] } },
		// 		],
		// 	},
		// ]);

		const albumId = '64a79fb2d9270005ccb6f901';
		const sectionId = '64a79fb2d9270005ccb6f902';
		const ids = [
			{ _id: '64a79fb2d9270005ccb6f903', eligible: false },
			{ _id: '64a79fb2d9270005ccb6f904', eligible: false },
			{ _id: '64a79fb2d9270005ccb6f905', eligible: true },
		];
		const r = await UploadAlbum.bulkWrite(
			ids.map((item) => {
				return {
					updateOne: {
						filter: {
							_id: new mongoose.Types.ObjectId(albumId),
							'sections._id': new mongoose.Types.ObjectId(sectionId),
						},
						update: { $set: { 'sections.$[].sectionData.media.$[m].eligible': item.eligible } },
						arrayFilters: [{ 'm._id': new mongoose.Types.ObjectId(item._id) }],
					},
				};
			}),
			{ ordered: false },
		);
		console.log(r);
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
