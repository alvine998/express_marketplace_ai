const Product = require("../models/Product");
const { Op } = require("sequelize");
const { uploadImageToFirebase } = require("../utils/firebaseUtils");
const { getPagination, getPagingData } = require("../utils/paginationUtils");
const { logActivity } = require("../utils/loggingUtils");

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      subcategoryId,
      isFlashSale,
      flashSalePrice,
      flashSaleExpiry,
    } = req.body;
    const sellerId = req.user.id;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadImageToFirebase(req.file);
    }

    const product = await Product.create({
      sellerId,
      name,
      description,
      price,
      stock,
      category,
      subcategoryId,
      imageUrl,
      isFlashSale: isFlashSale === "true" || isFlashSale === true,
      flashSalePrice,
      flashSaleExpiry,
    });

    await logActivity(req, "CREATE_PRODUCT", {
      productId: product.id,
      name: product.name,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during product creation" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { page, limit, subcategoryId, category, search } = req.query;
    const { limit: l, offset } = getPagination(page, limit);

    const where = {};
    if (subcategoryId) where.subcategoryId = subcategoryId;
    if (category) where.category = category;
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    const data = await Product.findAndCountAll({
      where,
      limit: l,
      offset: offset,
      order: [["createdAt", "DESC"]],
      include: ["subcategory", "seller"],
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error retrieving products" });
  }
};

exports.getFlashSaleProducts = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { limit: l, offset } = getPagination(page, limit);

    const data = await Product.findAndCountAll({
      where: {
        isFlashSale: true,
        flashSaleExpiry: {
          [Op.gt]: new Date(),
        },
      },
      limit: l,
      offset: offset,
      order: [["flashSaleExpiry", "ASC"]],
      include: ["subcategory", "seller"],
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error retrieving flash sale products" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: ["seller"],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error retrieving product" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      isFlashSale,
      flashSalePrice,
      flashSaleExpiry,
    } = req.body;
    const userId = req.user.id;

    let product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.sellerId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this product" });
    }

    let imageUrl = product.imageUrl;
    if (req.file) {
      imageUrl = await uploadImageToFirebase(req.file);
    }

    await product.update({
      name,
      description,
      price,
      stock,
      category,
      imageUrl,
      isFlashSale:
        isFlashSale !== undefined
          ? isFlashSale === "true" || isFlashSale === true
          : product.isFlashSale,
      flashSalePrice: flashSalePrice || product.flashSalePrice,
      flashSaleExpiry: flashSaleExpiry || product.flashSaleExpiry,
    });

    await logActivity(req, "UPDATE_PRODUCT", {
      productId: product.id,
      name: product.name,
    });

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.sellerId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this product" });
    }

    await product.destroy();

    await logActivity(req, "DELETE_PRODUCT", { productId: req.params.id });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error deleting product" });
  }
};
