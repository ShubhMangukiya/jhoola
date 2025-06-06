const Video = require('../model/Video');
const fs = require('fs');
const path = require('path');

// GET handler
const getVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ order: [['createdAt', 'DESC']] });
    if (!video) return res.status(404).json({ message: 'No video found' });
    res.json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT handler
const updateVideo = async (req, res) => {
  try {
    console.log('Request:', req.body, req.files);

    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!videoFile) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    // Try to find the existing video by ID or get the latest video
    let videoDoc;

    if (req.body.id) {
      videoDoc = await Video.findByPk(req.body.id);
    }
    if (!videoDoc) {
      // No existing video found, create new
      videoDoc = await Video.findOne({ order: [['createdAt', 'DESC']] });
    }

    if (!videoDoc) {
      // If no video in DB at all, create a new one
      videoDoc = Video.build();
    } else {
      // Remove old files if they exist
      if (videoDoc.video) {
        const oldVideoPath = path.join(__dirname, '..', 'uploads', path.basename(videoDoc.video));
        if (fs.existsSync(oldVideoPath)) fs.unlinkSync(oldVideoPath);
      }
      if (videoDoc.thumbnailImage) {
        const oldThumbPath = path.join(__dirname, '..', 'uploads', path.basename(videoDoc.thumbnailImage));
        if (fs.existsSync(oldThumbPath)) fs.unlinkSync(oldThumbPath);
      }
    }

    // Update fields
    videoDoc.video = '/uploads/' + videoFile.filename;
    if (thumbnailFile) {
      videoDoc.thumbnailImage = '/uploads/' + thumbnailFile.filename;
    }
    videoDoc.videoTitle = req.body.videoTitle || videoDoc.videoTitle;

    await videoDoc.save();

    res.status(200).json({ message: 'Video saved successfully', video: videoDoc });
  } catch (err) {
    console.error('Update video error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
module.exports = {
  getVideo,
  updateVideo,
};
