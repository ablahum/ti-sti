const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const Order = sequelize.define(
  'Order',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Trips',
        key: 'id',
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      type: DataTypes.ENUM('pending', 'on-going', 'finished', 'canceled'),
      defaultValue: 'pending',
    },
  },
  {
    timestamps: false,
  }
)

module.exports = Order
