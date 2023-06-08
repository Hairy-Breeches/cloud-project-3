const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

const postRoutes = require('./routes/posts');

const app = express();
app.use('/images', express.static(path.join('backend/images/')))
app.use("/", express.static(path.join(__dirname,"angular")));


mongoose
  .connect(
    "mongodb+srv://Hairy--Breeches:JguZ84dtgXQAtzlp@cluster0.hbvkq3y.mongodb.net/cloud-project?retryWrites=true&w=majority"
  )

  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed to database!");
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );

  next();
});

app.use('/api/posts', postRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular","index.html"));
})

module.exports = app;
