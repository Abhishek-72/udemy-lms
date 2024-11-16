const express = require("express");
const {
  addNewCourse,
  getAllCourses,
  getCourseDetailsById,
} = require("../controllers/courseController.js");
const router = express.Router();

router.post("/add", addNewCourse);
router.get("/get", getAllCourses);
router.get("/get/details/:id", getCourseDetailsById);

module.exports = router;
