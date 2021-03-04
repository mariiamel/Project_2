'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class coffeshop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  coffeshop.init({
    name: DataTypes.TEXT,
    adress: DataTypes.TEXT,
    rating: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    img: DataTypes.STRING,
    yelpId: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'coffeshop',
  });
  return coffeshop;
};