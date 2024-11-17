const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  public_id: { type: String, required: true },
  freePreview: { type: Boolean, default: false },
});

const courseSchema = new mongoose.Schema(
  {
    instructorId: { type: String, required: true },
    instructorName: { type: String, required: true },
    date: { type: Date, default: Date.now },
    title: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    language: { type: String, required: true },
    subTitle: { type: String },
    description: { type: String },
    image: { type: String },
    welcomeMessage: { type: String },
    pricing: { type: Number, min: 0 },
    Objective: { type: String },
    student: [
      {
        studentId: { type: String, required: true },
        studentName: { type: String, required: true },
        studentEmail: { type: String, required: true, match: /.+\@.+\..+/ },
      },
    ],
    ciriculam: [lectureSchema],
    isPublished: { type: Boolean, default: false },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Course", courseSchema);
