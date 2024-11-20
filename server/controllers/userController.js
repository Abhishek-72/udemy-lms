const crypto = require("crypto");
const User = require("../models/userModel");
const sendEmail = require("../utils/email.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

exports.forgotPassword = async (req, res, next) => {
  try {
    // 1) Get user based on the provided email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "There is no user with that email address!",
      });
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/user/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid for 10 minutes)",
        message,
      });

      return res.status(200).json({
        success: true,
        message: "Token sent successfully!",
      });
    } catch (err) {
      // Reset token fields if email fails to send
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message:
          "There was an error sending the email. Please try again later!",
      });
    }
  } catch (err) {
    // Pass unexpected errors to the global error handler
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  //1) Get user based on token
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2) If token has not expired , there is user, set the password

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Token is Invalid or expired.",
    });
  }
  user.password = req.body.password;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();
  //3) update password changedAt

  //4) Log the user In send JWt
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.status(200).json({
    success: true,
    token,
  });
  next();
};

// update user password
exports.updatePassword = async (req, res, next) => {
  //Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // check posted password from user is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return res.status(401).json({
      success: false,
      message: "You current password is wrong !",
    });
  }
  //if current password is correct then update password
  user.password = req.body.password;
  await user.save();
  //4) Log the user In send JWt
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.status(200).json({
    success: true,
    message: "Password changed Successfully !",
    token,
  });
  next();
};

// Update user doc
exports.updateMe = async (req, res, next) => {
  // Create error if user try to post password data
  if (req.body.password) {
    return res.status(400).json({
      success: false,
      message:
        "This route is not for password change. Please user /updatePassword route.",
    });
  }
  // Update user document
  const filteredBody = filterObj(req.body, "userName", "email");
  const Updateduser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    message: "User updated successfully !",
    data: Updateduser,
  });
  next();
};
