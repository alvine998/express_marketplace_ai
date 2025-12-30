const ProductRating = require('../models/ProductRating');
const SellerRating = require('../models/SellerRating');
const { getPagination, getPagingData } = require('../utils/paginationUtils');
const { logActivity } = require('../utils/loggingUtils');

exports.submitProductRating = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    const [productRating, created] = await ProductRating.findOrCreate({
      where: { userId, productId },
      defaults: { rating, comment },
    });

    if (!created) {
      await productRating.update({ rating, comment });
    }

    await logActivity(req, 'SUBMIT_PRODUCT_RATING', { productId, rating });

    res.status(200).json(productRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting product rating' });
  }
};

exports.getProductRatings = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { limit: l, offset } = getPagination(page, limit);
    const { productId } = req.params;

    const data = await ProductRating.findAndCountAll({
      where: { productId },
      limit: l,
      offset,
      include: ['user'],
      order: [['createdAt', 'DESC']],
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching product ratings' });
  }
};

exports.submitSellerRating = async (req, res) => {
  try {
    const { sellerId, rating, comment } = req.body;
    const userId = req.user.id;

    const [sellerRating, created] = await SellerRating.findOrCreate({
      where: { userId, sellerId },
      defaults: { rating, comment },
    });

    if (!created) {
      await sellerRating.update({ rating, comment });
    }

    await logActivity(req, 'SUBMIT_SELLER_RATING', { sellerId, rating });

    res.status(200).json(sellerRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting seller rating' });
  }
};

exports.getSellerRatings = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { limit: l, offset } = getPagination(page, limit);
    const { sellerId } = req.params;

    const data = await SellerRating.findAndCountAll({
      where: { sellerId },
      limit: l,
      offset,
      include: ['user'],
      order: [['createdAt', 'DESC']],
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching seller ratings' });
  }
};
