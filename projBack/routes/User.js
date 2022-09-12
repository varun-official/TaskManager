/** @format */

const express = require("express");
const routes = express.Router();
const User = require("../schema/User");
const auth = require("../middleware/Auth");

routes.post("/user", async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    const token = await newUser.generateToken();

    return res.status(201).send({ newUser, token });
  } catch (err) {
    return res.status(404).send(err);
  }
});

routes.post("/user/login", async (req, res) => {
  try {
    const user = await User.getUserById(req.body.email, req.body.password);
    const token = await user.generateToken();

    return res.status(200).send({ user, token });
  } catch (error) {
    return res.status(500).send(error);
  }
});

routes.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token != req.token
    );
    await req.user.save();

    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
});

routes.post("/user/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
});

routes.get("/user/me", auth, async (req, res) => {
  try {
    return res.status(200).send(req.user);
  } catch (error) {
    return res.status(500).send(error);
  }
});

routes.patch("/user/me", auth, async (req, res) => {
  const update = req.body;
  const updateitems = Object.keys(update);
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "No user found on this id" });
    }
    updateitems.map((items) => (user[items] = update[items]));
    await user.save();

    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});

routes.delete("/user/me", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    await User.findByIdAndDelete({ _id });
    return res.status(200).json({ result: "sucessfully deleted" });
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = routes;
