const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BroadcastNotification = sequelize.define(
  "BroadcastNotification",
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
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    targetAudience: {
      type: DataTypes.STRING,
      defaultValue: "ALL_USERS",
    },
    clickAction: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sentAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    successCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    failureCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "broadcast_notifications",
    timestamps: true,
  },
);

module.exports = BroadcastNotification;
