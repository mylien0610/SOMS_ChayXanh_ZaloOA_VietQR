"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PointMemberModel extends Model {
    static associate(models) {
      PointMemberModel.hasOne(models.UserModel, {
        foreignKey: "pointMemberId",
        as: "user",
      });
    }
  }
  PointMemberModel.init(
    {
      phoneNumber: DataTypes.STRING,
      value: DataTypes.INTEGER,
      otpCode: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "PointMemberModel",
      tableName: "pointMembers",
    }
  );
  return PointMemberModel;
};
