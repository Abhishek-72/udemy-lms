require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRoute.js");
const mediaRouter = require("./routes/mediaRoute.js");
const instructorCourseRouter = require("./routes/courseRoute.js");
const userRoute = require("./routes/userRoute.js");
// const verifyToken = require("./utils/verifyUser.js");
const rateLimit = require("express-rate-limit");

const app = express();
// Global middleware
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP. please try again in an hour !",
});
app.use("/api", limiter);
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
app.use("/api/auth", authRouter);
app.use("/api/user", userRoute);
app.use("/api/media", mediaRouter);
app.use("/api/instructor/course", instructorCourseRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went Wrong !";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT} !`);
});
