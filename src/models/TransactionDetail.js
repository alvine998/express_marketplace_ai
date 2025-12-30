const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Transaction = require('./Transaction');
const Product = require('./Product');

const TransactionDetail = sequelize.define('TransactionDetail', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  transactionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Transaction,
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
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'transaction_details',
});

Transaction.hasMany(TransactionDetail, { foreignKey: 'transactionId', as: 'details' });
TransactionDetail.belongsTo(Transaction, { foreignKey: 'transactionId', as: 'transaction' });
Product.hasMany(TransactionDetail, { foreignKey: 'productId', as: 'transactionDetails' });
TransactionDetail.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = TransactionDetail;
