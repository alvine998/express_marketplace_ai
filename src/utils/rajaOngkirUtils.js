const axios = require('axios');
const NodeCache = require('node-cache');
require('dotenv').config();

// Cache for 24 hours
const myCache = new NodeCache({ stdTTL: 86400 });

const rajaOngkir = axios.create({
  baseURL: 'https://api.rajaongkir.com/starter',
  headers: {
    key: process.env.RAJAONGKIR_API_KEY,
  },
});

exports.getProvinces = async () => {
  try {
    const cachedProvinces = myCache.get('provinces');
    if (cachedProvinces) return cachedProvinces;

    const response = await rajaOngkir.get('/province');
    const results = response.data.rajaongkir.results;
    
    myCache.set('provinces', results);
    return results;
  } catch (error) {
    console.error('RajaOngkir Province Error:', error.response?.data || error.message);
    throw error;
  }
};

exports.getCities = async (provinceId) => {
  try {
    const cacheKey = `cities_${provinceId}`;
    const cachedCities = myCache.get(cacheKey);
    if (cachedCities) return cachedCities;

    const response = await rajaOngkir.get(`/city?province=${provinceId}`);
    const results = response.data.rajaongkir.results;

    myCache.set(cacheKey, results);
    return results;
  } catch (error) {
    console.error('RajaOngkir City Error:', error.response?.data || error.message);
    throw error;
  }
};

exports.calculateCost = async (origin, destination, weight, courier) => {
  try {
    // We don't cache cost as it can vary, but we can if needed
    const response = await rajaOngkir.post('/cost', {
      origin,
      destination,
      weight,
      courier,
    });
    return response.data.rajaongkir.results;
  } catch (error) {
    console.error('RajaOngkir Cost Error:', error.response?.data || error.message);
    throw error;
  }
};
