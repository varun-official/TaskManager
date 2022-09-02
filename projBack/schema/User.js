/** @format */

const mongoose = require("mongoose");
const validator = require("validator");

var userschema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Not an email address");
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 8,
    validate(value) {
      if (value.toLowerCase().includes("password"))
        throw new Error("Not a valid password");
    },
  },
  age: {
    type: Number,
    required: true,
    trim: true,
    validate(value) {
      if (value < 0) throw new Error("Not a real age");
    },
  },
});

module.exports = mongoose.model("User", userschema);
