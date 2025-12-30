const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');

const ProductRating = sequelize.define('ProductRating', {
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
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Product,
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
  tableName: 'product_ratings',
});

Product.hasMany(ProductRating, { foreignKey: 'productId', as: 'ratings' });
ProductRating.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
User.hasMany(ProductRating, { foreignKey: 'userId', as: 'productRatings' });
ProductRating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = ProductRating;
