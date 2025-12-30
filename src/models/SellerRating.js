const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Seller = require('./Seller');

const SellerRating = sequelize.define('SellerRating', {
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
  sellerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Seller,
      key: 'id',
    },
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'seller_ratings',
});

Seller.hasMany(SellerRating, { foreignKey: 'sellerId', as: 'ratings' });
SellerRating.belongsTo(Seller, { foreignKey: 'sellerId', as: 'seller' });
User.hasMany(SellerRating, { foreignKey: 'userId', as: 'sellerRatings' });
SellerRating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = SellerRating;
