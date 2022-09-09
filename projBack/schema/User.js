/** @format */

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
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

userSchema.statics.getUserById = async function (email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("No User By Email");
  }

  const isMatch = bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Unable to Login");

  return user;
};

userSchema.methods = {
  securePassword: function (password) {
    if (!password) return "";
    try {
      return bcrypt.hash(password, 8);
    } catch (e) {
      return "";
    }
  },
  generateToken: async function () {
    const user = this;

    const token = jwt.sign({ _id: user._id.toString() }, "buymeacoffe");
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
  },
};

module.exports = mongoose.model("User", userSchema);
