const Seller = require('../models/Seller');
const { uploadImageToFirebase } = require('../utils/firebaseUtils');
const { logActivity } = require('../utils/loggingUtils');

exports.becomeSeller = async (req, res) => {
  try {
    const { storeName, description, address } = req.body;
    const userId = req.user.id;

    let seller = await Seller.findOne({ where: { userId } });
    if (seller) {
      return res.status(400).json({ message: 'User is already a seller' });
    }

    const existingStore = await Seller.findOne({ where: { storeName } });
    if (existingStore) {
      return res.status(400).json({ message: 'Store name is already taken' });
    }

    let logoUrl = null;
    if (req.file) {
      logoUrl = await uploadImageToFirebase(req.file);
    }

    seller = await Seller.create({
      userId,
      storeName,
      description,
      address,
      logoUrl,
    });

    await logActivity(req, 'REGISTER_SELLER', { storeName: seller.storeName });

    res.status(201).json(seller);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during seller registration' });
  }
};

exports.getOwnProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const seller = await Seller.findOne({ where: { userId } });

    if (!seller) {
      return res.status(404).json({ message: 'Seller profile not found' });
    }

    res.status(200).json(seller);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findByPk(req.params.id);

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.status(200).json(seller);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { storeName, description, address } = req.body;
    const userId = req.user.id;
    
    let seller = await Seller.findOne({ where: { userId } });

    if (!seller) {
      return res.status(404).json({ message: 'Seller profile not found' });
    }

    if (storeName && storeName !== seller.storeName) {
      const existingStore = await Seller.findOne({ where: { storeName } });
      if (existingStore) {
        return res.status(400).json({ message: 'Store name already taken' });
      }
    }

    let logoUrl = seller.logoUrl;
    if (req.file) {
      logoUrl = await uploadImageToFirebase(req.file);
    }

    await seller.update({
      storeName,
      description,
      address,
      logoUrl,
    });

    await logActivity(req, 'UPDATE_SELLER_PROFILE', { storeName: seller.storeName });

    res.status(200).json(seller);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating seller profile' });
  }
};

exports.adminVerifySeller = async (req, res) => {
  try {
    const seller = await Seller.findByPk(req.params.id);
    if (!seller) return res.status(404).json({ message: 'Seller not found' });

    await seller.update({ isVerified: true });
    await logActivity(req, 'ADMIN_VERIFY_SELLER', { sellerId: seller.id });

    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: 'Error verifying seller' });
  }
};

exports.adminToggleOfficial = async (req, res) => {
  try {
    const seller = await Seller.findByPk(req.params.id);
    if (!seller) return res.status(404).json({ message: 'Seller not found' });

    await seller.update({ isOfficial: !seller.isOfficial });
    await logActivity(req, 'ADMIN_TOGGLE_OFFICIAL_SELLER', { sellerId: seller.id, isOfficial: seller.isOfficial });

    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling official status' });
  }
};
