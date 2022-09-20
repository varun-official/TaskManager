/** @format */

const express = require("express");
const routes = express.Router();
const multer = require("multer");
const sharp = require("sharp");

const User = require("../schema/User");
const auth = require("../middleware/Auth");
const { signupmail, exitmail } = require("../Email/Sender");

routes.post("/user", async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    await signupmail(newUser.email, newUser.name);
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
  const _id = req.user._id;
  try {
    const deleteduser = await User.findByIdAndDelete({ _id });
    if (deleteduser) {
      await exitmail(req.user.email, req.user.name);
      return res.status(200).json({ result: "sucessfully deleted" });
    }
    return res.status(404).send({ error: "Unable to find the userID" });
  } catch (err) {
    return res.status(500).send(err);
  }
});

const fileupload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  },
});

routes.post(
  "/user/me/avatar",
  auth,
  fileupload.single("upload"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 300, height: 300 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.status(200).json({ Message: "Avatar Added Successfully" });
  },
  (err, req, res, next) => {
    res.send(400).json({ Error: err.message });
  }
);

routes.get("/user/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      res.status(404).json({ Message: "Avatar not found" });
    }

    res.set("Content-Type", "image/png");

    res.send(user.avatar);
  } catch (error) {
    res.status(404).send(error);
  }
});

routes.delete("/user/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

module.exports = routes;
