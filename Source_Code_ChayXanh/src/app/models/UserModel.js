"use strict";
const { Model } = require("sequelize");
import bcrypt from "bcrypt";
module.exports = (sequelize, DataTypes) => {
  class UserModel extends Model {
    static associate(models) {
      // define association here
      UserModel.hasMany(models.BookModel, {
        foreignKey: "userId",
        as: "books",
      });

      UserModel.hasMany(models.BelongStoreModel, {
        foreignKey: "userId",
        as: "tables",
      });

      UserModel.belongsTo(models.RoleModel, {
        foreignKey: "roleId",
        as: "role",
      });

      UserModel.belongsTo(models.PointMemberModel, {
        foreignKey: "pointMemberId",
        as: "pointMember",
      });

      UserModel.hasMany(models.StoreModel, {
        foreignKey: "managedBy",
      });

      UserModel.hasMany(models.OrderModel, {
        foreignKey: "paymentBy",
      });

      UserModel.belongsToMany(models.StoreModel, {
        through: models.BelongStoreModel,
        foreignKey: "userId",
        otherKey: "storeId",
        as: "stores",
      });
    }

    // Check password
    async isCorrectPassword(password) {
      return await bcrypt.compare(password, this.password);
    }
  }
  UserModel.init(
    {
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      gender: DataTypes.BOOLEAN,
      dob: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      password: DataTypes.STRING,
      pointMemberId: DataTypes.INTEGER,
      roleId: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "UserModel",
      tableName: "users",
      hooks: {
        // Run when create new user
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },

        // Run when create update user password
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  return UserModel;
};
