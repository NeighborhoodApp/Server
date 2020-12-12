"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Roles",
      [
        {
          role: "Super Admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          role: "Admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
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
