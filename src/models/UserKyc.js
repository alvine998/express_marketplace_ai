const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const UserKyc = sequelize.define('UserKyc', {
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
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idCardImageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  selfieImageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
}, {
  tableName: 'user_kycs',
});

// Associations
User.hasOne(UserKyc, { foreignKey: 'userId', as: 'kyc' });
UserKyc.belongsTo(User, { foreignKey: 'userId' });

module.exports = UserKyc;
