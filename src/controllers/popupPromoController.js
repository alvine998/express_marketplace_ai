const PopupPromo = require("../models/PopupPromo");
const {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} = require("../utils/firebaseUtils");
const { logActivity } = require("../utils/loggingUtils");
const { getPagination, getPagingData } = require("../utils/paginationUtils");

exports.createPopupPromo = async (req, res) => {
  try {
    const { title, message, ctaText, isActive, status } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadImageToFirebase(req.file);
    }

    const promo = await PopupPromo.create({
      title,
      message,
      ctaText,
      imageUrl,
      isActive: isActive === "true" || isActive === true,
      status: status || "draft",
    });

    await logActivity(req, "CREATE_POPUP_PROMO", {
      promoId: promo.id,
      title: promo.title,
    });

    res.status(201).json(promo);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error during popup promo creation" });
  }
};

exports.getAllPopupPromos = async (req, res) => {
  try {
    const { page, limit, activeOnly } = req.query;
    const { limit: l, offset } = getPagination(page, limit);

    const where = {};
    if (activeOnly === "true") {
      where.isActive = true;
      where.status = "published";
    }

    const data = await PopupPromo.findAndCountAll({
      where,
      limit: l,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error retrieving popup promos" });
  }
};

exports.getPopupPromoById = async (req, res) => {
  try {
    const promo = await PopupPromo.findByPk(req.params.id);

    if (!promo) {
      return res.status(404).json({ message: "Pop-up promo not found" });
    }

    res.status(200).json(promo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error retrieving popup promo" });
  }
};

exports.updatePopupPromo = async (req, res) => {
  try {
    const { title, message, ctaText, isActive, status } = req.body;
    let promo = await PopupPromo.findByPk(req.params.id);

    if (!promo) {
      return res.status(404).json({ message: "Pop-up promo not found" });
    }

    let imageUrl = promo.imageUrl;
    if (req.file) {
      if (promo.imageUrl) {
        await deleteImageFromFirebase(promo.imageUrl);
      }
      imageUrl = await uploadImageToFirebase(req.file);
    }

    await promo.update({
      title: title || promo.title,
      message: message || promo.message,
      ctaText: ctaText || promo.ctaText,
      imageUrl,
      isActive:
        isActive !== undefined
          ? isActive === "true" || isActive === true
          : promo.isActive,
      status: status || promo.status,
    });

    await logActivity(req, "UPDATE_POPUP_PROMO", {
      promoId: promo.id,
      title: promo.title,
    });

    res.status(200).json(promo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating popup promo" });
  }
};

exports.deletePopupPromo = async (req, res) => {
  try {
    const promo = await PopupPromo.findByPk(req.params.id);

    if (!promo) {
      return res.status(404).json({ message: "Pop-up promo not found" });
    }

    if (promo.imageUrl) {
      await deleteImageFromFirebase(promo.imageUrl);
    }

    await promo.destroy();

    await logActivity(req, "DELETE_POPUP_PROMO", { promoId: req.params.id });

    res.status(200).json({ message: "Pop-up promo deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error deleting popup promo" });
  }
};
