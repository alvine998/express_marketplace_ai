const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AppConfig = sequelize.define(
  "AppConfig",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "app_configs",
    timestamps: true,
  },
);

module.exports = AppConfig;
