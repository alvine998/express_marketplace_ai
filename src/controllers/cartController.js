const CartItem = require("../models/CartItem");
const { logActivity } = require("../utils/loggingUtils");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    let cartItem = await CartItem.findOne({ where: { userId, productId } });

    if (cartItem) {
      await cartItem.update({ quantity: cartItem.quantity + quantity });
    } else {
      cartItem = await CartItem.create({ userId, productId, quantity });
    }

    await logActivity(req, "ADD_TO_CART", { productId, quantity });

    res.status(200).json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding to cart" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { userId, productId } = req.query;

    // Default to current user's ID
    let targetUserId = req.user.id;

    // If admin provides a userId in query, use that instead
    if (req.user.role === "admin" && userId) {
      targetUserId = userId;
    }

    const whereCondition = { userId: targetUserId };

    if (productId) {
      whereCondition.productId = productId;
    }

    const cartItems = await CartItem.findAll({
      where: whereCondition,
      include: ["product"],
    });

    res.status(200).json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving cart" });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await CartItem.findByPk(req.params.id);

    if (!cartItem || cartItem.userId !== req.user.id) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.update({ quantity });
    await logActivity(req, "UPDATE_CART_ITEM", {
      cartItemId: cartItem.id,
      quantity,
    });

    res.status(200).json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating cart item" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cartItem = await CartItem.findByPk(req.params.id);

    if (!cartItem || cartItem.userId !== req.user.id) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.destroy();
    await logActivity(req, "REMOVE_FROM_CART", { cartItemId: req.params.id });

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing cart item" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await CartItem.destroy({ where: { userId: req.user.id } });
    await logActivity(req, "CLEAR_CART");
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error clearing cart" });
  }
};
