const express = require("express");
const multer = require("multer");
const {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} = require("../helper/cloudinary.js");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMediaToCloudinary(req.file.path);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error Uploading file",
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Asset id is required!",
      });
    }
    await deleteMediaFromCloudinary(id);
    res.status(200).json({
      success: true,
      message: "Asset deleted successfully from cloudinary",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error Uploading file",
    });
  }
});

module.exports = router;
