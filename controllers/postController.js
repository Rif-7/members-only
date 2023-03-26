const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.new_post_get = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  return res.render("new-post-form", { title: "Create new Post" });
};

exports.new_post_post = [
  body("title", "Title should have atleast 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("content", "Text should have atleast 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  async (req, res, next) => {
    if (!req.user) {
      return res.redirect("/login");
    }

    const post = new Post({
      user: req.user._id,
      title: req.body.title,
      text: req.body.content,
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.render("new-post-form", {
        title: "Create new Post",
        post: post,
        errors: errors.array(),
      });
    }

    try {
      await post.save();
      return res.redirect("/");
    } catch (err) {
      return next(err);
    }
  },
];

exports.post_list = async (req, res, next) => {
  const posts = await Post.find().sort({ timestamp: -1 });
  if (!req.user || !req.user.isMember) {
    return res.render("home.pug", { posts: posts });
  }
  res.send("TODO");
};
