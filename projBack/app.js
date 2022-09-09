/** @format */

//npm import
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoute = require("./routes/User");
const taskRoute = require("./routes/Task");

//connection variable
const app = express();
const PORT = process.env.PORT || 3000;

//DB connection
mongoose
  .connect(
    "mongodb+srv://Varun:jdVZGUfTZqbN8cLe@taskapp.nseppmq.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("DB Connection established");
  });

app.use(bodyParser.json());
app.use(userRoute);
app.use(taskRoute);

app.listen(PORT, () => {
  console.log(`App is runing of ${PORT}`);
});
