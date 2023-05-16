// @ts-nocheck
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: String,
  comments: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'comment'
  }]
});

PostSchema.pre('remove', async function () {
  console.log('this.comments: ', this.comments);
  const check = this.comments.map(c => c instanceof mongoose.Types.ObjectId)
  console.log(check);
  await this.model('comment').deleteMany({ _id: { $in: this.comments } })
})

export default mongoose.model('post', PostSchema);