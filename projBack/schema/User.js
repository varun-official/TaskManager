/** @format */

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
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
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Not an email address");
    },
  },
  password: {
    type: String,
    required: true,
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await this.securePassword(this.password);
    return next();
  } catch (error) {
    this.password = "";
    return next();
  }
});

userSchema.methods = {
  securePassword: function (password) {
    if (!password) return "";
    try {
      return bcrypt.hash(password, 8);
    } catch (e) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
