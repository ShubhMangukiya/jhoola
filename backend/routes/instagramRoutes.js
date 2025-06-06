const express = require("express");
const multer =  require("multer");
const { getInstagramSection, updateInstagramSection } =  require("../controller/instagramController.js");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const fields = [
  { name: "reel1Image", maxCount: 1 },
  { name: "reel2Image", maxCount: 1 },
  { name: "reel3Image", maxCount: 1 },
  { name: "reel4Image", maxCount: 1 }, 
  { name: "reel5Image", maxCount: 1 },
];

router.get("/", getInstagramSection);
router.put("/", upload.fields(fields), updateInstagramSection);

module.exports = router;
