"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderModel extends Model {
    static associate(models) {
      OrderModel.belongsTo(models.VoucherModel, {
        foreignKey: "voucherId",
        as: "voucher",
      });

      OrderModel.hasMany(models.OrderDetailModel, {
        foreignKey: "orderId",
        as: "orderDetails",
      });

      OrderModel.belongsTo(models.StoreModel, {
        foreignKey: "storeId",
        as: "store",
      });

      OrderModel.belongsTo(models.TableModel, {
        foreignKey: "tableId",
        as: "table",
      });

      OrderModel.belongsTo(models.UserModel, {
        foreignKey: "paymentBy",
        as: "user",
      });

      OrderModel.belongsToMany(models.ProductModel, {
        through: models.OrderDetailModel,
        foreignKey: "orderId",
        otherKey: "productId",
        as: "products",
      });
    }
  }
  OrderModel.init(
    {
      totalPrice: DataTypes.DECIMAL(18, 0),
      statusPay: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      fullName: DataTypes.STRING,
      tableNumber: DataTypes.STRING,
      paymentMethod: DataTypes.STRING,
      paymentBy: DataTypes.INTEGER,
      tableId: DataTypes.INTEGER,
      voucherId: DataTypes.INTEGER,
      storeId: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "OrderModel",
      tableName: "orders",
    }
  );
  return OrderModel;
};
