import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../components/Variable";

export default function SliderAdmin() {
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState({});
  const [videoData, setVideoData] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => {
    fetchSliderData();
    fetchVideoData();
  }, []);

  const fetchSliderData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/slider`);
      setFormData(res.data);
    } catch (err) {
      console.error("Failed to fetch slider data:", err);
    }
  };

  const handleChange = (e, field) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (file) {
        if (field.startsWith("image")) {
          // Slider images
          setFormData((prev) => ({ ...prev, [field]: file }));
          setPreview((prev) => ({
            ...prev,
            [field]: URL.createObjectURL(file),
          }));
        } else if (field === "video") {
          // Video file
          setFormData((prev) => ({ ...prev, video: file }));
          setPreview((prev) => ({ ...prev, video: URL.createObjectURL(file) }));
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    }
  };

  const handleThumbnailChange = (e) => {
    if (e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
      setThumbnailPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSliderSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (let i = 1; i <= 5; i++) {
      if (formData[`image${i}`] instanceof File) {
        data.append(`image${i}`, formData[`image${i}`]);
      }
      data.append(`slider${i}Link`, formData[`slider${i}Link`] || "");
    }

    try {
      await axios.put(`${API_URL}/api/slider`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Slider updated successfully.");
      fetchSliderData();
    } catch (err) {
      console.error("Failed to update slider:", err);
      alert("Failed to update slider.");
    }
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();

    if (!formData.video) {
      alert("Please select a video to upload.");
      return;
    }

    const data = new FormData();
    data.append("video", formData.video);
    data.append("videoTitle", videoData.videoTitle || "");

    if (videoData.id) {
      data.append("id", videoData.id);
    }

    if (thumbnailFile) {
      data.append("thumbnail", thumbnailFile);
    }

    try {
      setUploadProgress(0);
      await axios.put(`${API_URL}/api/video`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      alert("Video uploaded successfully");
      setUploadProgress(0);
      fetchVideoData();
      setThumbnailFile(null);
      setThumbnailPreview(null);
    } catch (err) {
      console.error("Video upload failed:", err);
      alert("Video upload failed");
      setUploadProgress(0);
    }
  };

  const fetchVideoData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/video`);
      setVideoData(res.data);
    } catch (err) {
      console.error("Failed to fetch video data:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-10">
      {/* Slider Form */}
      <form onSubmit={handleSliderSubmit} className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">Slider Admin Panel</h1>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border p-4 rounded-lg shadow">
            <label className="block mb-2 font-medium">Slider {i} Image</label>
            {preview[`image${i}`] ? (
              <img
                src={preview[`image${i}`]}
                alt={`Slider ${i}`}
                className="w-full max-w-xs mb-2"
              />
            ) : formData[`image${i}`] ? (
              <img
                src={`${API_URL}${formData[`image${i}`]}`}
                alt={`Slider ${i}`}
                className="w-full max-w-xs mb-2"
              />
            ) : null}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleChange(e, `image${i}`)}
              className="block mb-2"
            />
            <input
              type="text"
              placeholder="Enter link"
              value={formData[`slider${i}Link`] || ""}
              onChange={(e) => handleChange(e, `slider${i}Link`)}
              className="w-full border p-2 rounded"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Update Sliders
        </button>
      </form>

      {/* Video Upload Form */}
      <form
        onSubmit={handleVideoSubmit}
        className="space-y-4 border p-4 rounded-lg shadow"
      >
        <h2 className="text-xl font-bold mb-2">Video Upload</h2>

        {/* Video preview */}
        {preview.video ? (
          <video
            src={preview.video}
            controls
            className="w-full max-w-md mb-2"
          />
        ) : videoData.video ? (
          <video
            src={`${API_URL}${videoData.video}`}
            controls
            className="w-full max-w-md mb-2"
          />
        ) : null}

        {/* Video file input */}
        <input
          type="file"
          accept="video/*"
          onChange={(e) => handleChange(e, "video")}
          className="block mb-2"
        />

        {/* Thumbnail preview */}
        {thumbnailPreview ? (
          <img
            src={thumbnailPreview}
            alt="Thumbnail Preview"
            className="w-48 h-auto mb-2"
          />
        ) : videoData.thumbnail ? (
          <img
            src={`${API_URL}${videoData.thumbnail}`}
            alt="Current Thumbnail"
            className="w-48 h-auto mb-2"
          />
        ) : null}

        {/* Thumbnail file input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          className="block mb-2"
        />

        {/* Video title input */}
        <input
          type="text"
          placeholder="Enter video title"
          value={videoData.videoTitle || ""}
          onChange={(e) =>
            setVideoData((prev) => ({ ...prev, videoTitle: e.target.value }))
          }
          className="w-full border p-2 rounded"
        />

        {/* Upload progress bar */}
        {uploadProgress > 0 && (
          <>
            <div className="w-full bg-gray-200 rounded h-4 overflow-hidden mt-2">
              <div
                className="bg-blue-500 h-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-700 mt-1">
              {uploadProgress}% uploaded
            </p>
          </>
        )}

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          disabled={uploadProgress > 0 && uploadProgress < 100}
        >
          {uploadProgress > 0 && uploadProgress < 100
            ? "Uploading..."
            : "Upload Video"}
        </button>
      </form>
    </div>
  );
}
