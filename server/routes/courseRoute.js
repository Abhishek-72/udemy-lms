const express = require("express");
const {
  addNewCourse,
  getMyAllCourses,
  getCourseDetailsById,
  updateCourseById,
} = require("../controllers/courseController.js");
const { protect } = require("../controllers/authController.js");
const { isInstructor } = require("../controllers/roleController.js");
const router = express.Router();

router.post("/create", protect, isInstructor, addNewCourse);
router.get("/get", protect, isInstructor, getMyAllCourses);
router.get("/get/details/:id", protect, isInstructor, getCourseDetailsById);
router.put("/update/:id", protect, isInstructor, updateCourseById);

module.exports = router;
