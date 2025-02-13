'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class BelongStoreModel extends Model {
        static associate(models) {
            BelongStoreModel.belongsTo(models.UserModel, {
                foreignKey: 'userId',
            });

            BelongStoreModel.belongsTo(models.StoreModel, {
                foreignKey: 'storeId',
            });
        }
    }
    BelongStoreModel.init(
        {
            userId: {
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            storeId: {
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            modelName: 'BelongStoreModel',
            tableName: 'belongStores',
        }
    );
    return BelongStoreModel;
};
