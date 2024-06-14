const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const Trip = sequelize.define(
  'Trip',
  {
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
)

module.exports = Trip
