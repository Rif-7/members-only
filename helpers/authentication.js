const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const validatePassword = async (username, password, done) => {
  console.log("here");
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false, {
        type: "SignUpMessage",
        message: "Incorrect username or password",
      });
    }
    const res = await bcrypt.compare(password, user.password);

    if (!res) {
      return done(null, false, {
        type: "SignUpMessage",
        message: "Incorrect username or password",
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

exports.createHash = async (password) => {
  return await bcrypt.hash(password, 10);
};

passport.use(new LocalStrategy(validatePassword));

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await User.findById(userId);
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
});
