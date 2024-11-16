const express = require("express");
const {
  addNewCourse,
  getAllCourses,
} = require("../controllers/courseController.js");
const router = express.Router();

router.post("/add", addNewCourse);
router.get("/get", getAllCourses);

module.exports = router;
