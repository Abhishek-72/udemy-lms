const Course = require("../models/courseModel.js");

exports.addNewCourse = async (req, res, next) => {
  try {
    const courseData = req.body;
    const newCourse = new Course(courseData);
    const saveCourse = await newCourse.save();
    res.status(201).json({
      success: true,
      message: "Course Created Successfully !",
      data: {
        course: saveCourse,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllCourses = async (req, res, next) => {
  try {
    const courseList = await Course.find({});
    res.status(200).json({
      success: true,
      data: courseList,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCourseDetailsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (error) {
    next(error);
  }
};
