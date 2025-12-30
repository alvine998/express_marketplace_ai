const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Address = sequelize.define('Address', {
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
  label: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., Home, Office',
  },
  receiverName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  provinceId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  province: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cityId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  district: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'user_addresses',
});

User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Address;
