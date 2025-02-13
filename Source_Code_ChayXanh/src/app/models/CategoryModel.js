"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CategoryModel extends Model {
    static associate(models) {
      CategoryModel.hasMany(models.ProductModel, {
        foreignKey: 'categoryId',
        as: 'products'
      });
    }
  }
  CategoryModel.init(
    {
      title: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "CategoryModel",
      tableName: "categories",
    }
  );
  return CategoryModel;
};
