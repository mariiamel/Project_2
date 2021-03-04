'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class coffeeshop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.coffeeshop.belongsToMany(models.user, { through: "users_coffeeshops"})
    }
  };
  coffeeshop.init({
    name: DataTypes.TEXT,
    address: DataTypes.TEXT,
    rating: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    img: DataTypes.STRING,
    yelpId: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'coffeeshop',
  });
  return coffeeshop;
};