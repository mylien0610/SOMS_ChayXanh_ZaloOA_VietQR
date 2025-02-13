"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      totalPrice: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      statusPay: {
        type: Sequelize.STRING,
        defaultValue: "Chưa thanh toán",
      },
      phoneNumber: Sequelize.STRING,
      fullName: Sequelize.STRING,
      tableNumber: Sequelize.STRING,
      paymentMethod: Sequelize.STRING,
      paymentBy: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      tableId: {
        type: Sequelize.INTEGER,
        references: {
          model: "tables",
          key: "id",
        },
      },
      voucherId: {
        type: Sequelize.INTEGER,
        references: {
          model: "vouchers",
          key: "id",
        },
      },
      storeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "stores",
          key: "id",
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
    await queryInterface.dropTable("orders");
  },
};
