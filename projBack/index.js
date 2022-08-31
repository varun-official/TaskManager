/** @format */

//npm import
const express = require("express");
const mongoose = require("mongoose");

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

// app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`App is runing of ${PORT}`);
});
