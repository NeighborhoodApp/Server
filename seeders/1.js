"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Roles",
      [
        {
          id: 1,
          role: "Super Admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          role: "Admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          role: "Warga",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Roles", null, {});
  },
};
