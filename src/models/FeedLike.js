const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const FeedPost = require('./FeedPost');

const FeedLike = sequelize.define('FeedLike', {
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
  postId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: FeedPost,
      key: 'id',
    },
  },
}, {
  tableName: 'feed_likes',
});

User.hasMany(FeedLike, { foreignKey: 'userId', as: 'feedLikes' });
FeedLike.belongsTo(User, { foreignKey: 'userId', as: 'user' });
FeedPost.hasMany(FeedLike, { foreignKey: 'postId', as: 'likes' });
FeedLike.belongsTo(FeedPost, { foreignKey: 'postId', as: 'post' });

module.exports = FeedLike;
