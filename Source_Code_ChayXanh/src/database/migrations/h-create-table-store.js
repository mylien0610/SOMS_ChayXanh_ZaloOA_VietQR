'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('stores', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            storeName: Sequelize.STRING,
            address: Sequelize.TEXT,
            phoneNumber: Sequelize.STRING,
            active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            default: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            managedBy: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            status: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('stores');
    },
};
