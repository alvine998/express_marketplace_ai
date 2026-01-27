const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Faq = sequelize.define(
  "Faq",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "faqs",
    timestamps: true,
  },
);

module.exports = Faq;
