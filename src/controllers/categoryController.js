const Category = require("../models/Category");
const { Op } = require("sequelize");
const {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} = require("../utils/firebaseUtils");
const { getPagination, getPagingData } = require("../utils/paginationUtils");
const { logActivity } = require("../utils/loggingUtils");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadImageToFirebase(req.file);
    }

    const category = await Category.create({ name, imageUrl });

    await logActivity(req, "CREATE_CATEGORY", {
      categoryId: category.id,
      name: category.name,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating category" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const { limit: l, offset } = getPagination(page, limit);

    const whereClause = {};
    if (search && search.length > 2) {
      whereClause.name = { [Op.like]: `%${search}%` };
    }

    const data = await Category.findAndCountAll({
      limit: l,
      offset,
      order: [["createdAt", "DESC"]],
      where: whereClause,
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching categories" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: ["subcategories"],
    });
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching category" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update name if provided
    if (name) {
      category.name = name;
    }

    // Update image if new file provided
    if (req.file) {
      // Delete old image from Firebase if exists
      if (category.imageUrl) {
        try {
          await deleteImageFromFirebase(category.imageUrl);
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
      category.imageUrl = await uploadImageToFirebase(req.file);
    }

    await category.save();

    await logActivity(req, "UPDATE_CATEGORY", {
      categoryId: category.id,
      name: category.name,
    });

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating category" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete image from Firebase if exists
    if (category.imageUrl) {
      try {
        await deleteImageFromFirebase(category.imageUrl);
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }

    const categoryName = category.name;
    await category.destroy();

    await logActivity(req, "DELETE_CATEGORY", {
      categoryId: id,
      name: categoryName,
    });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting category" });
  }
};
