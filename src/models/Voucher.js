const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Voucher = sequelize.define(
  "Voucher",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM("discount", "cashback"),
      allowNull: false,
    },
    valueType: {
      type: DataTypes.ENUM("percentage", "fixed"),
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    minTransaction: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    maxLimit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Maximum discount/cashback amount for percentage type",
    },
    quota: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: -1,
      comment: "-1 for unlimited",
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "vouchers",
  },
);

module.exports = Voucher;
