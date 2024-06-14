const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const Order = sequelize.define(
  'Order',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
)

module.exports = Order
