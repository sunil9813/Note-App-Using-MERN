import mongoose from "mongoose"

const postSchema = mongoose.Schema({
  title: String,
  message: String,
  name: String,
  creator: String,
  tags: [String],
  selectedFile: String,
  likes: {
    //type: Number,
    //default: 0,
    type: [String],
    default: [],
  },
  createAt: {
    type: Date,
    default: new Date(),
  },
})

var PostMessage = mongoose.model("PostMessage", postSchema)
export default PostMessage
