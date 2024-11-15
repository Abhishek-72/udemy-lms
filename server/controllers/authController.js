const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res, next) => {
  const { userName, email, password } = req.body;
  const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
  if (existingUser)
    return res.status(400).json({
      success: false,
      message: "UserName or UserEmail already exist !",
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
    message: "User resgistered Successfully !",
  });
};
