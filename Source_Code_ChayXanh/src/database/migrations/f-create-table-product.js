'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('products', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: Sequelize.STRING,
            price: Sequelize.INTEGER,
            image: Sequelize.TEXT,
            description: Sequelize.TEXT,
            categoryId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'categories',
                    key: 'id',
                },
            },
            typeOfFoodId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'typeOfFoods',
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
        await queryInterface.dropTable('products');
    },
};
