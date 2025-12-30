const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { getPagination, getPagingData } = require('../utils/paginationUtils');
const { logActivity } = require('../utils/loggingUtils');

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const [wishlistItem, created] = await Wishlist.findOrCreate({
      where: { userId, productId },
    });

    if (!created) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    await logActivity(req, 'ADD_TO_WISHLIST', { productId });

    res.status(201).json(wishlistItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { limit: l, offset } = getPagination(page, limit);
    const userId = req.user.id;

    const data = await Wishlist.findAndCountAll({
      where: { userId },
      limit: l,
      offset,
      include: [{ model: Product, as: 'product' }],
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const result = await Wishlist.destroy({
      where: { userId, productId },
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }

    await logActivity(req, 'REMOVE_FROM_WISHLIST', { productId });

    res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
};
