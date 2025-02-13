'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('tables', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            tableNumber: Sequelize.STRING,
            tableStatus: Sequelize.STRING,
            type: Sequelize.STRING,
            maximumNumberOfPeople: Sequelize.INTEGER,
            storeId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'stores',
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
        await queryInterface.dropTable('tables');
    },
};
