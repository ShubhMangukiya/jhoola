const express = require("express");
const multer = require("multer");
const { getSliderSection, updateSliderSection } = require("../controller/sliderController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

const fields = [
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
  { name: 'image5', maxCount: 1 }
];

router.get("/", getSliderSection);
router.put("/", upload.fields(fields), updateSliderSection);

module.exports = router;
