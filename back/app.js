const express = require("express");
require("dotenv").config();
const connectToDatabase = require("./database/dbConfig");
const user = require("./routes/user");
const food = require("./routes/food");
const admin = require("./routes/admin");
const errorMiddleware = require("./middlewares/error");

const app = express();
var cors = require("cors");
app.use(cors());
// console.log("safsd", process.env.MONGO_URI);
//express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(400).send("Api working");
});

app.use("/user", user);
app.use("/food", food);
app.use("/admin", admin);

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    errors: [
      {
        msg: "Route not found",
      },
    ],
  });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

connectToDatabase().then((_) => {
  app.listen(PORT, (_) => {
    console.log(`Server started on port ${PORT}`);
  });
});
