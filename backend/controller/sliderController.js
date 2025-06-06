const imageSlider = require('../model/imageSlider');

const getSliderSection = async (req, res) => {
  try {
    const section = await imageSlider.findOne({ order: [['id', 'DESC']] });
    if (!section) return res.status(404).json({ message: "No Data Found" });
    res.json(section);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Data" });
  }
};

const updateSliderSection = async (req, res) => {
  try {
    const files = req.files || {};
    const body = req.body;

    const data = {};
    for (let i = 1; i <= 5; i++) {
      if (files[`image${i}`] && files[`image${i}`][0]) {
        data[`image${i}`] = `/uploads/${files[`image${i}`][0].filename}`;
      }
      data[`slider${i}Link`] = body[`slider${i}Link`] || "";
    }

    const existing = await imageSlider.findOne({ order: [["id", "DESC"]] });

    if (existing) {
      await existing.update(data);
      return res.status(200).json({ message: "Section updated", section: existing });
    } else {
      const section = await imageSlider.create(data);
      return res.status(201).json({ message: "Section created", section });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
};

module.exports = {
  getSliderSection,
  updateSliderSection
};
