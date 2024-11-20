const express = require("express");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/userController.js");
const { protect } = require("../controllers/authController.js");

const router = express.Router();
router.post("/forgotPassword", protect, forgotPassword);
router.patch("/resetPassword/:token", protect, resetPassword);

module.exports = router;
