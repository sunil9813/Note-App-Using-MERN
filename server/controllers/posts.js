import mongoose from "mongoose"
import PostMessage from "../models/postMessage.js"
import express from "express"

const router = express.Router()

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find()
    res.status(200).json(postMessages)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
export const getPost = async (req, res) => {
  const { id } = req.params
  try {
    const post = await PostMessage.findById(id)
    res.status(200).json(post)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
export const createPost = async (req, res) => {
  const post = req.body
  const newPost = new PostMessage({ ...post, creator: req.userId, createAt: new Date().toISOString() })
  try {
    await newPost.save()
    res.status(201).json(newPost)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
  console.log("Create Post")
}
export const updatePost = async (req, res) => {
  const { id } = req.params
  // const post = req.body
  const { title, message, creator, selectedFile, tags } = req.body

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post is with that id : ${id}`)
  const updatePost = { title, message, creator, selectedFile, tags, _id: id }
  await PostMessage.findByIdAndUpdate(id, updatePost, { new: true })
  res.json(updatePost)
  console.log("Update Post")
}
export const deletePost = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post is with that id : ${id}`)

  //await PostMessage.findByIdAndDelete(_id)
  await PostMessage.findByIdAndRemove(id)
  console.log("Delete")
  res.json({ message: "Post Delete Successfully" })
}

export const likePost = async (req, res) => {
  const { id } = req.params

  // yadi user chai xaina bhane
  if (!req.userId) {
    return res.json({ message: "Unauthenticated" })
  }

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post is with that id : ${id}`)

  const post = await PostMessage.findById(id)

  // ekchot matra like garna paune
  const index = post.likes.findIndex((id) => id === String(res.userId))
  if (index === -1) {
    // like the post
    post.likes.push(req.userId)
  } else {
    // dislike a post
    post.likes = post.likes.filter((id) => id !== String(req.userId))
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true })

  res.json(updatedPost)
}
/*export const likePost = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post is with that id")
  const post = await PostMessage.findById(id)
  const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true })
  res.json(updatedPost)
}*/
