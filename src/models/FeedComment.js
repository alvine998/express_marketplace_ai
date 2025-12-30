const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const FeedPost = require('./FeedPost');

const FeedComment = sequelize.define('FeedComment', {
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
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'feed_comments',
});

User.hasMany(FeedComment, { foreignKey: 'userId', as: 'feedComments' });
FeedComment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
FeedPost.hasMany(FeedComment, { foreignKey: 'postId', as: 'comments' });
FeedComment.belongsTo(FeedPost, { foreignKey: 'postId', as: 'post' });

module.exports = FeedComment;
