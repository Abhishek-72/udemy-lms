require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRoute.js");
const mediaRouter = require("./routes/mediaRoute.js");
const instructorCourseRouter = require("./routes/courseRoute.js");
const verifyToken = require("./utils/verifyUser.js");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

//Database Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Mongo db is connected"))
  .catch((e) => console.log(e));

// Routes config
app.use("/auth", authRouter);
app.use("/media", mediaRouter);
app.use("/instructor/course", verifyToken, instructorCourseRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went Wrong !";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT} !`);
});
