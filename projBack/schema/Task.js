/** @format */

const mongoose = require("mongoose");

var taskschema = mongoose.Schema(
  {
    description: {
      type: "string",
      required: true,
      trim: true,
    },
    completed: {
      type: "boolean",
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskschema);
