const axios = require("axios");
const redis = require("../config/redis");
require("dotenv").config();

// Cache TTL: 24 hours in seconds
const CACHE_TTL = 86400;

const rajaOngkir = axios.create({
  baseURL: "https://api.rajaongkir.com/starter",
  headers: {
    key: process.env.RAJAONGKIR_API_KEY,
  },
});

exports.getProvinces = async () => {
  try {
    const cacheKey = "rajaongkir:provinces";
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log("Cache hit for provinces");
      return JSON.parse(cachedData);
    }

    console.log("Cache miss for provinces, fetching from API...");
    const response = await rajaOngkir.get("/province");
    const results = response.data.rajaongkir.results;

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(results));
    return results;
  } catch (error) {
    console.error(
      "RajaOngkir Province Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

exports.getCities = async (provinceId) => {
  try {
    const cacheKey = `rajaongkir:cities:${provinceId}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for cities of province ${provinceId}`);
      return JSON.parse(cachedData);
    }

    console.log(
      `Cache miss for cities of province ${provinceId}, fetching from API...`,
    );
    const response = await rajaOngkir.get(`/city?province=${provinceId}`);
    const results = response.data.rajaongkir.results;

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(results));
    return results;
  } catch (error) {
    console.error(
      "RajaOngkir City Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

exports.calculateCost = async (origin, destination, weight, courier) => {
  try {
    // Optional: cache shipping costs for short periods (e.g., 1 hour)
    const cacheKey = `rajaongkir:cost:${origin}:${destination}:${weight}:${courier}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log("Cache hit for shipping cost");
      return JSON.parse(cachedData);
    }

    console.log("Cache miss for shipping cost, fetching from API...");
    const response = await rajaOngkir.post("/cost", {
      origin,
      destination,
      weight,
      courier,
    });
    const results = response.data.rajaongkir.results;

    // Cache for 1 hour
    await redis.setex(cacheKey, 3600, JSON.stringify(results));
    return results;
  } catch (error) {
    console.error(
      "RajaOngkir Cost Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
