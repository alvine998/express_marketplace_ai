const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PopupPromo = sequelize.define(
  "PopupPromo",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ctaText: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Shop Now",
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM("draft", "published"),
      defaultValue: "draft",
    },
  },
  {
    tableName: "popup_promos",
    timestamps: true,
  },
);

module.exports = PopupPromo;
