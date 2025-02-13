"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BookModel extends Model {
    static associate(models) {
      BookModel.belongsTo(models.UserModel, {
        foreignKey: "userId",
        as: "user",
      });

      BookModel.belongsTo(models.TableModel, {
        foreignKey: "tableId",
        as: "table",
      });
    }
  }
  BookModel.init(
    {
      tableId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      peopleNumber: DataTypes.INTEGER,
      date: DataTypes.DATE,
      time: DataTypes.TIME,
      statusBook: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "BookModel",
      tableName: "books",
    }
  );
  return BookModel;
};
