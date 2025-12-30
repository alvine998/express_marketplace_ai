const Subcategory = require('../models/Subcategory');
const { getPagination, getPagingData } = require('../utils/paginationUtils');
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
    const { page, limit } = req.query;
    const { limit: l, offset } = getPagination(page, limit);

    const data = await Subcategory.findAndCountAll({
      where: { categoryId: req.params.categoryId },
      limit: l,
      offset,
      order: [['name', 'ASC']],
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching subcategories' });
  }
};
