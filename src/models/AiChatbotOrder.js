const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Seller = require("./Seller");

const AiChatbotOrder = sequelize.define(
  "AiChatbotOrder",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sellerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Seller,
        key: "id",
      },
    },
    botName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    packageType: {
      type: DataTypes.ENUM("basic", "premium", "enterprise"),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    status: {
      type: DataTypes.ENUM("pending", "paid", "activated", "cancelled"),
      defaultValue: "pending",
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "ai_chatbot_orders",
    timestamps: true,
  },
);

Seller.hasMany(AiChatbotOrder, { foreignKey: "sellerId", as: "chatbotOrders" });
AiChatbotOrder.belongsTo(Seller, { foreignKey: "sellerId", as: "seller" });

module.exports = AiChatbotOrder;
