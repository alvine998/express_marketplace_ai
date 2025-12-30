const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const ChatRoom = sequelize.define('ChatRoom', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  participant1Id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  participant2Id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  lastMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  lastMessageAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'chat_rooms',
});

ChatRoom.belongsTo(User, { foreignKey: 'participant1Id', as: 'participant1' });
ChatRoom.belongsTo(User, { foreignKey: 'participant2Id', as: 'participant2' });

module.exports = ChatRoom;
