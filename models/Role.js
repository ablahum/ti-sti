const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Role = sequelize.define(
  'Role',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
)

module.exports = Role
