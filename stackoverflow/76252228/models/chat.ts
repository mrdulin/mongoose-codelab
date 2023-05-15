import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
      text: {
        type: String,
        trim: true
      }
    }
  ]
},
  {
    timestamps: true
  }
)

export default mongoose.model('chat', ChatSchema)
