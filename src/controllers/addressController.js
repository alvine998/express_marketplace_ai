const Address = require('../models/Address');
const { getPagination, getPagingData } = require('../utils/paginationUtils');
const { logActivity } = require('../utils/loggingUtils');

exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      label, receiverName, phoneNumber, provinceId, 
      province, cityId, city, district, fullAddress, isPrimary 
    } = req.body;

    // If this is the first address or isPrimary is true, handle primary logic
    const existingAddresses = await Address.count({ where: { userId } });
    const shouldBePrimary = isPrimary || existingAddresses === 0;

    if (shouldBePrimary) {
      await Address.update({ isPrimary: false }, { where: { userId } });
    }

    const address = await Address.create({
      userId,
      label,
      receiverName,
      phoneNumber,
      provinceId,
      province,
      cityId,
      city,
      district,
      fullAddress,
      isPrimary: shouldBePrimary,
    });

    await logActivity(req, 'ADD_ADDRESS', { addressId: address.id, label });

    res.status(201).json(address);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding address' });
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { limit: l, offset } = getPagination(page, limit);
    const userId = req.user.id;

    const data = await Address.findAndCountAll({
      where: { userId },
      limit: l,
      offset,
      order: [['isPrimary', 'DESC'], ['createdAt', 'DESC']],
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching addresses' });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    const address = await Address.findOne({ where: { id, userId } });
    if (!address) return res.status(404).json({ message: 'Address not found' });

    if (updateData.isPrimary && !address.isPrimary) {
      await Address.update({ isPrimary: false }, { where: { userId } });
    }

    await address.update(updateData);
    await logActivity(req, 'UPDATE_ADDRESS', { addressId: id });

    res.status(200).json(address);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating address' });
  }
};

exports.setPrimary = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const address = await Address.findOne({ where: { id, userId } });
    if (!address) return res.status(404).json({ message: 'Address not found' });

    await Address.update({ isPrimary: false }, { where: { userId } });
    await address.update({ isPrimary: true });

    await logActivity(req, 'SET_PRIMARY_ADDRESS', { addressId: id });

    res.status(200).json(address);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error setting primary address' });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const address = await Address.findOne({ where: { id, userId } });
    if (!address) return res.status(404).json({ message: 'Address not found' });

    if (address.isPrimary) {
      return res.status(400).json({ message: 'Cannot delete primary address. Set another one as primary first.' });
    }

    await address.destroy();
    await logActivity(req, 'DELETE_ADDRESS', { addressId: id });

    res.status(200).json({ message: 'Address deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting address' });
  }
};
