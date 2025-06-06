// controller/categoryController.js
const Category = require("../model/categoryModel");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "Category name is required" });
    const imageUrl = req.file ? req.file.filename : null;

    const category = await Category.create({
      name,
      imageUrl,
    });

    return res.status(201).json(category);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Category name must be unique" });
    }
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    await category.destroy();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
};

exports.updatecategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;
    const imageUrl = req.file ? req.file.filename : null;

    await Category.update({ name, imageUrl }, { where: { categoryId } });
    const updateCategory = await Category.findOne({ where: { categoryId } });
    res.status(200).send({
      message: "Category Updated Successfully",
      Category: updateCategory,
    });
    console.log("Update Category", categoryId, updateCategory);
  } catch (error) {
    res.status(500).json({ message: "error to get category" });
    console.log(error);
  }
};
