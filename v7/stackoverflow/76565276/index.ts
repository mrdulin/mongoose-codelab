import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.set('debug', true);

const imageUploadSchema = new mongoose.Schema({
	image: [{ type: mongoose.Schema.Types.ObjectId, ref: 'influencerimg' }],
});
const ImageUpload = mongoose.model('image-upload', imageUploadSchema);

const ImgSchema = new mongoose.Schema({
	bio: String,
	image: String,
});
const Influencerimg = mongoose.model('influencerimg', ImgSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		await Promise.all([ImageUpload, Influencerimg].map((m) => m.collection.drop()));
		// seed
		const [img1, img2] = await Influencerimg.create([
			{ bio: 'a', image: 'img-a' },
			{ bio: 'b', image: 'img-b' },
		]);
		const imageUpload = new ImageUpload();
		// @ts-ignore
		imageUpload.image.push(img1, img2);
		await imageUpload.save();

		// test
		const r = await ImageUpload.findOne({ _id: imageUpload._id }).populate({ path: 'image', select: 'image' });
		console.log(r?.toObject());
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
