const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  googleAccessToken: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

userSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});
const User = mongoose.model("User", userSchema);

module.exports = User;
