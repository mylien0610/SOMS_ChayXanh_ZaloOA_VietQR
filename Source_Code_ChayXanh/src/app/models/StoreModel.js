'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class StoreModel extends Model {
        static associate(models) {
            StoreModel.hasMany(models.OrderModel, {
                foreignKey: 'storeId',
                as: 'orders',
            });

            StoreModel.hasMany(models.TableModel, {
                foreignKey: 'storeId',
                as: 'tables',
            });

            StoreModel.hasMany(models.BelongStoreModel, {
                foreignKey: 'storeId',
                as: 'belongStores',
            });

            StoreModel.belongsTo(models.UserModel, {
                foreignKey: 'managedBy',
            });

            StoreModel.belongsToMany(models.UserModel, {
                through: models.BelongStoreModel,
                foreignKey: 'storeId',
                otherKey: 'userId',
                as: 'staff',
            });
        }
    }
    StoreModel.init(
        {
            storeName: DataTypes.STRING,
            address: DataTypes.TEXT,
            phoneNumber: DataTypes.STRING,
            default: DataTypes.BOOLEAN,
            active: DataTypes.BOOLEAN,
            managedBy: DataTypes.INTEGER,
            status: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'StoreModel',
            tableName: 'stores',
        }
    );
    return StoreModel;
};
