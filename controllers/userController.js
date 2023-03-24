const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const { createHash } = require("../helpers/authentication");
const passport = require("passport");

exports.sign_up_get = (req, res, next) => {
  return res.render("sign-up-form", { title: "Create Account " });
};

exports.sign_up_post = [
  body("username")
    .trim()
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        return await Promise.reject("Username already taken");
      }
      return true;
    })
    .isLength({ min: 4, max: 18 })
    .withMessage("Username is required (4-18 characters) ")
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
      return res.render("sign-up-form", {
        title: "Create account",
        user: user,
        errors: errors.array(),
      });
    }

    try {
      const passwordHash = await createHash(req.body.password);
      const user = await new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: passwordHash,
      }).save();

      // Can't use async/await for req.login
      // TODO: use util.promisify to make req.login return a promise
      await req.login(user, (err) => {
        if (err) return next(err);
        return res.redirect("/");
      });
    } catch (err) {
      return next(err);
    }
  },
];

exports.login_get = (req, res, next) => {
  return res.render("login-form", {
    title: "Login",
    errors: req.flash("SignUpMessage"),
  });
};

exports.login_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
});

exports.logout = (req, res, next) => {
  // Can't use async/await for req.logout
  // TODO: use util.promisify to make req.logout return a promise
  req.logout((err) => {
    if (err) return next(err);
    return res.redirect("/");
  });
};

exports.membership_get = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  return res.render("membership-form", { title: "Be a member" });
};

exports.membership_post = async (req, res, next) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  if (req.body.code !== process.env.MEMBERSHIP_CODE) {
    return res.render("membership-form", {
      title: "Be a member",
      error: "Incorrect Code",
    });
  }
  try {
    const user = req.user;
    user.isMember = true;
    await user.save();

    return res.redirect("/");
  } catch (err) {
    return next(err);
  }
};

exports.admin_get = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  return res.render("admin-form", { title: "Be an Admin" });
};

exports.admin_post = async (req, res, next) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  if (req.body.code !== process.env.ADMIN_CODE) {
    return res.render("admin-form", {
      title: "Be an Admin",
      error: "Incorrect Code",
    });
  }
  try {
    const user = req.user;
    user.isAdmin = true;
    await user.save();

    return res.redirect("/");
  } catch (err) {
    return next(err);
  }
};
