/** @format */

const express = require("express");
const routes = express.Router();
const Task = require("../schema/Task");

routes.post("/task", async (req, res) => {
  const newTask = new Task(req.body);

  try {
    const addedTask = await newTask.save();
    return res.status(201).send(addedTask);
  } catch (error) {
    return res.status(500).send(error);
  }
});

routes.get("/tasks", async (req, res) => {
  try {
    const allTask = await Task.find({});
    return res.status(200).send(allTask);
  } catch (error) {
    return res.status(500).send(error);
  }
});

routes.get("/task/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById({ _id });
    if (!task) {
      return res.status(404).json({ error: "No task with id" });
    }
    return res.status(200).send(task);
  } catch (error) {
    return res.status(500).send(error);
  }
});

routes.patch("/task/:id", async (req, res) => {
  const _id = req.params.id;
  const updateTask = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      { _id },
      { $set: updateTask },
      { new: true, runValidators: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(200).send(updatedTask);
  } catch (error) {
    return res.status(500).send(error);
  }
});

routes.delete("/task/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const deletedTask = await Task.findByIdAndDelete({ _id });

    if (!deletedTask) {
      return res.status(404).json({ error: "Task id not found for delete" });
    }
    return res.status(200).send(deletedTask);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = routes;
