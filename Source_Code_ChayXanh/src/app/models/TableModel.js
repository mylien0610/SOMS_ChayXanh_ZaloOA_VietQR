"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TableModel extends Model {
    static associate(models) {
      TableModel.hasMany(models.OrderModel, {
        foreignKey: "tableId",
        as: "orders",
      });

      TableModel.hasMany(models.BookModel, {
        foreignKey: "tableId",
        as: "books",
      });

      TableModel.belongsTo(models.StoreModel, {
        foreignKey: "storeId",
        as: "store",
      });
    }
  }
  TableModel.init(
    {
      tableNumber: DataTypes.STRING,
      tableStatus: DataTypes.STRING,
      type: DataTypes.STRING,
      maximumNumberOfPeople: DataTypes.INTEGER,
      storeId: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "TableModel",
      tableName: "tables",
    }
  );
  return TableModel;
};
