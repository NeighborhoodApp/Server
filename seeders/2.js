"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Developers",
      [
        {
          name: "Developer 1",
          email: "developer1@gmail.com",
          address: "Jl. Alamat Developer 1, Nama Kota",
          RoleId: 1,
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Developer 2",
          email: "developer2@gmail.com",
          address: "Jl. Alamat Developer 2, Nama Kota",
          RoleId: 1,
          status: "Inactive",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Developer 2",
          email: "developer3@gmail.com",
          address: "Jl. Alamat Developer 2, Nama Kota",
          RoleId: 1,
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Developers", null, {});
  },
};
