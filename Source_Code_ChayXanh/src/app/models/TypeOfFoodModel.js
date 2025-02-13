"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TypeOfFoodModel extends Model {
    static associate(models) {
      TypeOfFoodModel.hasMany(models.ProductModel, {
        foreignKey: 'typeOfFoodId',
        as: 'products'
      });
    }
  }
  TypeOfFoodModel.init(
    {
      title: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "TypeOfFoodModel",
      tableName: "typeOfFoods",
    }
  );
  return TypeOfFoodModel;
};
