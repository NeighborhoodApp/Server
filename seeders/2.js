"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Developers",
      [
        {
          name: "Citra Lamb",
          email: "citralamb@mail.com",
          address: "Jl. Citra Lamb, No.12, Bandung",
          RoleId: "1",
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          name: "Sedaya Grup",
          email: "sedaya@mail.com",
          address: "Jl. Sedaya Grup, No.12, Lampung",
          RoleId: "1",
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Padamara Land",
          email: "padamara@mail.com",
          address: "Jl. Citra Lamb, No.12, Palembang",
          RoleId: "1",
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "CItrus Grand City",
          email: "citrusgrandcity@mail.com",
          address: "Jl. Citra Lamb, No.12, Surabaya",
          RoleId: "1",
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
