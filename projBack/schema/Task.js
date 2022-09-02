/** @format */

const mongoose = require("mongoose");

var taskschema = mongoose.Schema({
  description: {
    type: "string",
    required: true,
    trim: true,
  },
  completed: {
    type: "boolean",
    default: false,
  },
});

module.exports = mongoose.model("TaskSchema", taskschema);
