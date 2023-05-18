import mongoose, { HydratedDocument } from 'mongoose';
import { expectTypeOf } from 'expect-type';

interface Blog {
  title: string,
}

const blogSchema = new mongoose.Schema<Blog>({
  title: String,
});

const BlogModel = mongoose.model<Blog>('Blog', blogSchema);

function takeModelInstance(instance: HydratedDocument<Blog>) {

}

const demo3: InstanceType<typeof BlogModel> = new BlogModel();

expectTypeOf(demo3).toMatchTypeOf<HydratedDocument<Blog>>()

// mongoose.Document<unknown, any, Blog> & Omit<Blog & {
//     _id: mongoose.Types.ObjectId;
// }, never>

// mongoose.Document<unknown, any, Blog> & Omit<Blog & {
//   _id: mongoose.Types.ObjectId;
// }, never>



