const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getVideo, updateVideo } = require('../controller/videoController');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.get('/', getVideo);

// Accept both video and thumbnail
router.put(
  '/',
  upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]),
  updateVideo
);

module.exports = router;
