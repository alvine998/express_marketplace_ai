const Category = require('../models/Category');
const { uploadImageToFirebase } = require('../utils/firebaseUtils');
const { getPagination, getPagingData } = require('../utils/paginationUtils');
const { logActivity } = require('../utils/loggingUtils');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadImageToFirebase(req.file);
    }

    const category = await Category.create({ name, imageUrl });
    
    await logActivity(req, 'CREATE_CATEGORY', { categoryId: category.id, name: category.name });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating category' });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { limit: l, offset } = getPagination(page, limit);

    const data = await Category.findAndCountAll({
      limit: l,
      offset,
      order: [['name', 'ASC']],
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: ['subcategories']
    });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching category' });
  }
};
