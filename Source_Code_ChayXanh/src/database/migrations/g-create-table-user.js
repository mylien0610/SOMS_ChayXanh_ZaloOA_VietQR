"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fullName: Sequelize.STRING,
      email: Sequelize.STRING,
      gender: Sequelize.BOOLEAN,
      dob: Sequelize.DATE,
      password: Sequelize.TEXT,
      pointMemberId: {
        type: Sequelize.INTEGER,
        references: {
          model: "pointMembers",
          key: "id",
        },
      },
      roleId: {
        type: Sequelize.INTEGER,
        references: {
          model: "roles",
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
    await queryInterface.dropTable("users");
  },
};
