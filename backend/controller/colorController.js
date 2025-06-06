const Color = require('../model/colorModel');

exports.createColor = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Color name is required' });
    }

    const color = await Color.create({ name });
    return res.status(201).json(color);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Color name must be unique' });
    }
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all colors
exports.getColor = async (req, res) => {
  try {
    const color = await Color.findAll({ order: [['createdAt', 'DESC']] });
    res.json(color);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching colors' });
  }
};

// Delete Color by ID
exports.deleteColor = async (req, res) => {
  try {
    const { id } = req.params;
    const color = await Color.findByPk(id);
    if (!color) {
      return res.status(404).json({ message: 'Color not found' });
    }
    await color.destroy();
    res.json({ message: 'Color deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting color' });
  }
};

