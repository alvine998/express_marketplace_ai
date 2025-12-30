const rajaOngkir = require('../utils/rajaOngkirUtils');

exports.getProvinces = async (req, res) => {
  try {
    const provinces = await rajaOngkir.getProvinces();
    res.status(200).json(provinces);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching provinces' });
  }
};

exports.getCities = async (req, res) => {
  try {
    const cities = await rajaOngkir.getCities(req.params.provinceId);
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cities' });
  }
};

exports.calculateCost = async (req, res) => {
  try {
    const { origin, destination, weight, courier } = req.body;
    const costs = await rajaOngkir.calculateCost(origin, destination, weight, courier);
    res.status(200).json(costs);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating shipping cost' });
  }
};
