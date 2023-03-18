const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, minLength: 4, maxLength: 18 },
  firstname: { type: String, required: true, minLength: 2, maxLength: 18 },
  lastname: { type: String, required: true, minLength: 2, maxLength: 18 },
  password: { type: String, required: true },
  isMember: { type: Boolean, required: true, default: false },
  isAdmin: { type: Boolean, required: true, default: false },
});

UserSchema.virtual("fullname").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

module.exports = mongoose.model("User", UserSchema);
