const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const FeedPost = sequelize.define('FeedPost', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'feed_posts',
});

User.hasMany(FeedPost, { foreignKey: 'userId', as: 'posts' });
FeedPost.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = FeedPost;
