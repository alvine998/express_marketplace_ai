const Voucher = require("../models/Voucher");
const { Op } = require("sequelize");
const { logActivity } = require("../utils/loggingUtils");

/**
 * Create a new voucher
 */
exports.createVoucher = async (req, res) => {
  try {
    const {
      code,
      type,
      valueType,
      value,
      minTransaction,
      maxLimit,
      quota,
      expiryDate,
      isActive,
    } = req.body;

    const existingVoucher = await Voucher.findOne({ where: { code } });
    if (existingVoucher) {
      return res
        .status(400)
        .json({ success: false, message: "Voucher code already exists" });
    }

    const voucher = await Voucher.create({
      code,
      type,
      valueType,
      value,
      minTransaction,
      maxLimit,
      quota,
      expiryDate,
      isActive,
    });

    await logActivity(req, "CREATE_VOUCHER", {
      voucherId: voucher.id,
      code: voucher.code,
    });

    res.status(201).json({ success: true, data: voucher });
  } catch (error) {
    console.error("Error in createVoucher:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Get all vouchers (Admin only)
 */
exports.getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ success: true, data: vouchers });
  } catch (error) {
    console.error("Error in getAllVouchers:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Get active vouchers for users
 */
exports.getActiveVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { expiryDate: null },
          { expiryDate: { [Op.gt]: new Date() } },
        ],
        [Op.or]: [{ quota: -1 }, { quota: { [Op.gt]: 0 } }],
      },
    });
    res.status(200).json({ success: true, data: vouchers });
  } catch (error) {
    console.error("Error in getActiveVouchers:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Update a voucher
 */
exports.updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const voucher = await Voucher.findByPk(id);
    if (!voucher) {
      return res
        .status(404)
        .json({ success: false, message: "Voucher not found" });
    }

    await voucher.update(updateData);

    await logActivity(req, "UPDATE_VOUCHER", { voucherId: id });

    res.status(200).json({ success: true, data: voucher });
  } catch (error) {
    console.error("Error in updateVoucher:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Delete a voucher
 */
exports.deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findByPk(id);
    if (!voucher) {
      return res
        .status(404)
        .json({ success: false, message: "Voucher not found" });
    }

    await voucher.destroy();

    await logActivity(req, "DELETE_VOUCHER", { voucherId: id });

    res.status(200).json({ success: true, message: "Voucher deleted" });
  } catch (error) {
    console.error("Error in deleteVoucher:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Validate and calculate voucher benefit
 */
exports.validateVoucher = async (req, res) => {
  try {
    const { code, transactionAmount } = req.body;

    const voucher = await Voucher.findOne({
      where: {
        code,
        isActive: true,
        [Op.or]: [
          { expiryDate: null },
          { expiryDate: { [Op.gt]: new Date() } },
        ],
        [Op.or]: [{ quota: -1 }, { quota: { [Op.gt]: 0 } }],
      },
    });

    if (!voucher) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid or expired voucher" });
    }

    if (parseFloat(transactionAmount) < parseFloat(voucher.minTransaction)) {
      return res.status(400).json({
        success: false,
        message: `Minimum transaction for this voucher is ${voucher.minTransaction}`,
      });
    }

    let benefitAmount = 0;
    if (voucher.valueType === "percentage") {
      benefitAmount =
        (parseFloat(transactionAmount) * parseFloat(voucher.value)) / 100;
      if (voucher.maxLimit && benefitAmount > parseFloat(voucher.maxLimit)) {
        benefitAmount = parseFloat(voucher.maxLimit);
      }
    } else {
      benefitAmount = parseFloat(voucher.value);
    }

    res.status(200).json({
      success: true,
      data: {
        voucherId: voucher.id,
        code: voucher.code,
        type: voucher.type,
        benefitAmount: benefitAmount.toFixed(2),
        finalAmount: (
          parseFloat(transactionAmount) -
          (voucher.type === "discount" ? benefitAmount : 0)
        ).toFixed(2),
      },
    });
  } catch (error) {
    console.error("Error in validateVoucher:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
