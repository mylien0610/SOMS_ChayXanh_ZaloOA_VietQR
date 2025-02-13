'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            'roles',
            [
                {
                    roleName: 'Quản trị viên (ROOT)',
                    status: false,
                    createdAt: '2024-08-22 14:58:58',
                    updatedAt: '2024-08-22 14:58:58',
                },
                {
                    roleName: 'Quản lý',
                    status: false,
                    createdAt: '2024-08-22 14:58:58',
                    updatedAt: '2024-08-22 14:58:58',
                },
                {
                    roleName: 'Nhân viên',
                    status: false,
                    createdAt: '2024-08-22 14:58:58',
                    updatedAt: '2024-08-22 14:58:58',
                },
                {
                    roleName: 'Khách hàng',
                    status: false,
                    createdAt: '2024-08-22 14:58:58',
                    updatedAt: '2024-08-22 14:58:58',
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('roles', null, {});
    },
};
