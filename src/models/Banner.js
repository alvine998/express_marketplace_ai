const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Banner = sequelize.define(
  "Banner",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    targetUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    type: {
      type: DataTypes.ENUM("promo", "headline"),
      defaultValue: "headline",
    },
  },
  {
    tableName: "banners",
  },
);

module.exports = Banner;
