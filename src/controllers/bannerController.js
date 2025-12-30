const Banner = require('../models/Banner');
const { uploadImageToFirebase } = require('../utils/firebaseUtils');
const { getPagination, getPagingData } = require('../utils/paginationUtils');
const { logActivity } = require('../utils/loggingUtils');

exports.createBanner = async (req, res) => {
  try {
    const { title, targetUrl } = req.body;
    let imageUrl = null;

    if (!req.file) {
      return res.status(400).json({ message: 'Banner image is required' });
    }

    imageUrl = await uploadImageToFirebase(req.file);

    const banner = await Banner.create({
      title,
      imageUrl,
      targetUrl,
    });

    await logActivity(req, 'CREATE_BANNER', { bannerId: banner.id, title: banner.title });

    res.status(201).json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during banner creation' });
  }
};

exports.getAllBanners = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { limit: l, offset } = getPagination(page, limit);

    const data = await Banner.findAndCountAll({
      where: { isActive: true },
      limit: l,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving banners' });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { title, targetUrl, isActive } = req.body;
    let banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    let imageUrl = banner.imageUrl;
    if (req.file) {
      imageUrl = await uploadImageToFirebase(req.file);
    }

    await banner.update({
      title,
      targetUrl,
      isActive,
      imageUrl,
    });

    await logActivity(req, 'UPDATE_BANNER', { bannerId: banner.id, title: banner.title });

    res.status(200).json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating banner' });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    await banner.destroy();
    
    await logActivity(req, 'DELETE_BANNER', { bannerId: req.params.id });

    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting banner' });
  }
};
