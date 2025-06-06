const InstagramSection = require("../model/InstagramSection.js");

const getInstagramSection = async (req, res) => {
  try {
    const section = await InstagramSection.findOne({ order: [["id", "DESC"]] });
    if (!section) return res.status(404).json({ message: "No data found" });
    res.json(section);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

const updateInstagramSection = async (req, res) => {
  try {
    const files = req.files || {};
    const body = req.body;

    const data = {};
    for (let i = 1; i <= 5; i++) {
      if (files[`reel${i}Image`] && files[`reel${i}Image`][0]) {
        data[`reel${i}Image`] = `/uploads/${files[`reel${i}Image`][0].filename}`;
      }
      data[`reel${i}Link`] = body[`reel${i}Link`] || "";
      data[`reel${i}Alt`] = body[`reel${i}Alt`] || "";
    }

    const existing = await InstagramSection.findOne({ order: [["id", "DESC"]] });

    if (existing) {
      await existing.update(data);
      return res.status(200).json({ message: "Section updated", section: existing });
    } else {
      const section = await InstagramSection.create(data);
      return res.status(201).json({ message: "Section created", section });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
};

module.exports = {
  getInstagramSection,
  updateInstagramSection,
};
