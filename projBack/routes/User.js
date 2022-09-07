/** @format */

const express = require("express");
const routes = express.Router();
const User = require("../schema/User");

routes.post("/user", async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    return res.status(201).send(newUser);
  } catch (err) {
    return res.status(404).send(err);
  }
});

routes.get("/users", async (req, res) => {
  try {
    const allUser = await User.find({});
    return res.status(200).send(allUser);
  } catch (error) {
    return res.status(500).send(error);
  }
});


routes.get("/user/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById({ _id });
    if (!user) {
      return res.status(404).json({ error: "No user found on this id" });
    }
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});

routes.patch("/user/:id", async (req, res) => {
  const _id = req.params.id;
  const update = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      { _id },
      { $set: update },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!user) {
      return res.status(404).json({ error: "No user found on this id" });
    }
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});

routes.delete("/user/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    await User.findByIdAndDelete({ _id });
    return res.status(200).json({ result: "sucessfully deleted" });
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = routes;
