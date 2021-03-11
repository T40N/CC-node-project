import express, { Response, Request } from 'express';
import mongoose from 'mongoose';
const router = express.Router();
const Post = require("../models/posts");

router.post("/", (req: Request, res: Response) => {
    Post.find({ image: req.body.image }).exec().then((posts) => {
        if (posts.length > 0) {
            return res.status(409).json({ message: "That image was already posted" });
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

            post.save().then((result) => {
                return res.status(201).json(post);
            }).catch((err) => {
                return res.status(500).json({ error: err });
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

module.exports = router;