/** @format */

const express = require("express");
const routes = express.Router();
const Task = require("../schema/Task");
const auth = require("../middleware/Auth");

routes.post("/task", auth, async (req, res) => {
  const newTask = new Task({ ...req.body, owner: req.user._id });

  try {
    const addedTask = await newTask.save();
    return res.status(201).send(addedTask);
  } catch (error) {
    return res.status(500).send(error);
  }
});

routes.get("/tasks", auth, async (req, res) => {
  var match = {};
  const sort = {};
  if (req.query.completed) {
    match = {
      owner: req.user._id,
      completed: req.query.completed == "true" ? true : false,
    };
  } else {
    match = { owner: req.user._id };
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] == "desc" ? -1 : 1;
  }

  try {
    // await req.user
    //   .populate({
    //     path: "tasks",
    //     match,
    //     options: {
    //       limit: parseInt(req.query.limit),
    //       skip: parseInt(req.query.skip),
    //       sort,
    //     },
    //   })
    //   .execPopulate();

    //(Both are the same)
    const allTask = await Task.find(
      match,
      {},
      {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      }
    );
    return res.status(200).send(allTask);
  } catch (error) {
    return res.status(500).send(error);
  }
});

routes.get("/task/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).json({ error: "No task with id" });
    }
    return res.status(200).send(task);
  } catch (error) {
    return res.status(500).send(error);
  }
});

routes.patch("/task/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updateTask = req.body;
  const updateitems = Object.keys(updateTask);
  try {
    const updatedTask = await Task.findOne({ _id, owner: req.user._id });
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    updateitems.map((item) => (updatedTask[item] = updateTask[item]));
    return res.status(200).send(updatedTask);
  } catch (error) {
    return res.status(500).send(error);
  }
});

routes.delete("/task/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const deletedTask = await Task.findOneAndDelete({
      _id,
      owner: req.user._id,
    });

    if (!deletedTask) {
      return res.status(404).json({ error: "Task id not found for delete" });
    }
    return res.status(200).send(deletedTask);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = routes;
