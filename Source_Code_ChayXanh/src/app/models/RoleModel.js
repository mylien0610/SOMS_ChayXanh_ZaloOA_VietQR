'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RoleModel extends Model {
        static associate(models) {
            RoleModel.hasMany(models.UserModel, {
                foreignKey: 'roleId',
                as: 'users',
            });
        }
    }
    RoleModel.init(
        {
            roleName: DataTypes.STRING,
            status: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'RoleModel',
            tableName: 'roles',
        }
    );
    return RoleModel;
};
