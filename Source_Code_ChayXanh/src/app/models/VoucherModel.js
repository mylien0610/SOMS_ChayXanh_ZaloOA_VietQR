'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class VoucherModel extends Model {
        static associate(models) {
            VoucherModel.hasMany(models.OrderModel, {
                foreignKey: 'voucherId',
                as: 'orders',
            });
        }
    }
    VoucherModel.init(
        {
            title: DataTypes.STRING,
            voucherCode: DataTypes.STRING,
            value: DataTypes.INTEGER,
            dateStart: DataTypes.DATE,
            dateEnd: DataTypes.DATE,
            quantity: DataTypes.INTEGER,
            status: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'VoucherModel',
            tableName: 'vouchers',
        }
    );
    return VoucherModel;
};
