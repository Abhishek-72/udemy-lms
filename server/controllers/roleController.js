exports.isInstructor = (req, res, next) => {
  if (req.user.role !== "instructor") {
    return res.status(403).json({
      success: false,
      message: "Access denied ! You are not a instructor.",
    });
  }
  next();
};

exports.isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({
      success: false,
      message: "Access denied ! You are not a student",
    });
  }
  next();
};
