import express, { Response, Request } from "express";
import mongoose from "mongoose";
const router = express.Router();
const Post = require("../models/posts");

router.post("/", (req: Request, res: Response) => {
  Post.find({ title: req.body.title })
    .exec()
    .then(posts => {
      if (posts.length > 0) {
        return res
          .status(409)
          .json({ message: "Title of this posts already exists" });
      } else {
        Post.find({ image: req.body.image })
          .exec()
          .then(posts => {
            if (posts.length > 0) {
              return res
                .status(409)
                .json({ message: "That image was already posted" });
            } else {
              const post = new Post({
                _id: new mongoose.Types.ObjectId(),
                title: req.body.title,
                tags: req.body.tags,
                image: req.body.image,
                author: req.body.author, //autorIdRead() from localstorage will be used here
                likes: 0,
                comments: []
              });

              post
                .save()
                .then(result => {
                  return res.status(201).json(post);
                })
                .catch(err => {
                  return res.status(500).json({ error: err });
                });
            }
          });
      }
    });
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(400).json({ message: err });
  }
});

router.get("/:postId", async (req: Request, res: Response) => {
  if (mongoose.Types.ObjectId.isValid(req.params.postId)) {
    const post = await Post.findById(req.params.postId);
    if (!post)
      return res.status(404).send("The post with the given ID was not found.");
    res.send(post);
  } else res.status(404).send("Invalid ID");
});

router.delete("/:postId", async (req: Request, res: Response) => {
  if (mongoose.Types.ObjectId.isValid(req.params.postId)) {
    const post = await Post.findByIdAndRemove(req.params.postId);
    if (!post)
      return res.status(404).send("The post with the given ID was not found.");
    res.status(200).send(post);
  } else
    return res.status(404).send("Invalid ID");
});

module.exports = router;
