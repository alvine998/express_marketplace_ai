const Subcategory = require('../models/Subcategory');
const { logActivity } = require('../utils/loggingUtils');

exports.createSubcategory = async (req, res) => {
  try {
    const { categoryId, name } = req.body;
    const subcategory = await Subcategory.create({ categoryId, name });
    
    await logActivity(req, 'CREATE_SUBCATEGORY', { subcategoryId: subcategory.id, name: subcategory.name });

    res.status(201).json(subcategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating subcategory' });
  }
};

exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const subcategories = await Subcategory.findAll({
      where: { categoryId: req.params.categoryId },
      order: [['name', 'ASC']],
    });
    res.status(200).json(subcategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching subcategories' });
  }
};
