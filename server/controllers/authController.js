const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;
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
    });
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User registered Successfully !",
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const checkUser = await User.findOne({ email });
    if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const token = jwt.sign({ id: checkUser._id }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = checkUser._doc;
    const expiryDate = new Date(Date.now() + 3600000);

    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: expiryDate,
        secure: true,
      })
      .status(200)
      .json({
        success: true,
        message: "Logged in successfully !",
        data: {
          rest,
        },
      });
  } catch (error) {
    next(error);
  }
};
