const express = require("express");
const {
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/userController.js");
const { protect } = require("../controllers/authController.js");

const router = express.Router();
router.post("/forgotPassword", protect, forgotPassword);
router.patch("/resetPassword/:token", protect, resetPassword);
router.patch("/updatePassword", protect, updatePassword);

module.exports = router;
