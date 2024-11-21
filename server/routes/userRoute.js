const express = require("express");
const {
  forgotPassword,
  resetPassword,
  updatePassword,
  updateMe,
  deleteMe,
} = require("../controllers/userController.js");
const { protect } = require("../controllers/authController.js");

const router = express.Router();
router.post("/forgotPassword", protect, forgotPassword);
router.patch("/resetPassword/:token", protect, resetPassword);
router.patch("/updatePassword", protect, updatePassword);
router.patch("/updateMe", protect, updateMe);
router.delete("/deleteMe", protect, deleteMe);

module.exports = router;
