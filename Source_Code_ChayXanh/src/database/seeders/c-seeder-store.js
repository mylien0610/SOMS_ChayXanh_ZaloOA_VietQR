'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            'stores',
            [
                {
                    storeName: 'Cửa hàng 1',
                    address: 'Địa chỉ 1',
                    phoneNumber: '0123456789',
                    default: true,
                    managedBy: 2,
                    createdAt: '2024-08-22 14:58:58',
                    updatedAt: '2024-08-22 14:58:58',
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('stores', null, {});
    },
};
