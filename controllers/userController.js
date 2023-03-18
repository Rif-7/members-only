const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const { createHash } = require("../helpers/authentication");

exports.createUser = [
  body("username", "Username is required (4-18 characters) ")
    .trim()
    .isLength({ min: 4, max: 18 })
    .escape(),
  body("firstname", "Firstname is required (3-18 characters) ")
    .trim()
    .isLength({ min: 2, max: 18 })
    .escape(),
  body("lastname", "Lastname is required (3-18 characters) ")
    .trim()
    .isLength({ min: 2, max: 18 })
    .escape(),
  body("password", "Password should be atleast 6 characters long")
    .trim()
    .isLength({ min: 6 })
    .escape(),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const user = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
      });
      return res.render("sign_up_form", {
        title: "Create account",
        user: user,
        errors: errors.array(),
      });
    }

    try {
      const passwordHash = await createHash(req.body.password);
      const user = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: passwordHash,
      });

      await user.save();
      await req.login(user);
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  },
];
