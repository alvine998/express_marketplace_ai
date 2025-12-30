const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const ChatRoom = require('./ChatRoom');

const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  chatRoomId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: ChatRoom,
      key: 'id',
    },
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'chat_messages',
});

ChatRoom.hasMany(ChatMessage, { foreignKey: 'chatRoomId', as: 'messages' });
ChatMessage.belongsTo(ChatRoom, { foreignKey: 'chatRoomId', as: 'room' });
ChatMessage.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

module.exports = ChatMessage;
