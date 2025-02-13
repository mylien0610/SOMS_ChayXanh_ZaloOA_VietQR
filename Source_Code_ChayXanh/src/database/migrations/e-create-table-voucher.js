'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('vouchers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: Sequelize.STRING,
            voucherCode: Sequelize.STRING,
            value: Sequelize.INTEGER,
            dateStart: Sequelize.DATE,
            dateEnd: Sequelize.DATE,
            quantity: Sequelize.INTEGER,
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
        await queryInterface.dropTable('vouchers');
    },
};
