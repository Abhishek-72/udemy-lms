const { promisify } = require("util");
const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { error } = require("console");

exports.registerUser = async (req, res, next) => {
  try {
    const { userName, email, password, role, passwordChangedAt } = req.body;
    const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
    if (existingUser)
      return res.status(400).json({
        success: false,
        message: "User already exist ! Please sign in.",
      });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      passwordChangedAt,
      role,
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "120m",
    });
    return res.status(201).json({
      success: true,
      message: "User registered Successfully !",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password !",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password !",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "120m",
    });
    // const expiryDate = new Date(Date.now() + 3600000);

    res.status(200).json({
      status: "success",
      token,
      message: "Logged in successfully !",
    });
  } catch (error) {
    next(error);
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if the token exists in the header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You are not logged in! Please log in to get access.",
      });
    }

    // Verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if the user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "The user belonging to this token no longer exists.",
      });
    }
    // check if user was changed password after token was issused
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        success: false,
        message: "User recently changed password ! Please log in again",
      });
    }

    // Attach user data to the request

    req.user = currentUser;

    next(); // Proceed to the next middleware
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({
        success: false,
        message: "Token expired. Please log in again.",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }

    next(err); // Pass any other errors to the global error handler
  }
};
