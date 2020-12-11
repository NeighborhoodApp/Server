"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Complexes", [
      {
        id: 1,
        name: "Real Estet 1 Komplek A1",
        RealEstateId: 1,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Real Estet 1 Komplek B1",
        RealEstateId: 1,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "Real Estet 1 Komplek C1",
        RealEstateId: 1,
        status: "Inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: "Real Estet 2 Komplek A2",
        RealEstateId: 2,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: "Real Estet 2 Komplek B2",
        RealEstateId: 2,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        name: "Real Estet 3 Komplek A3",
        RealEstateId: 3,
        status: "Inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        name: "Real Estet 3 Komplek B3",
        RealEstateId: 3,
        status: "Inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        name: "Real Estet 4 Komplek A4",
        RealEstateId: 4,
        status: "Inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 9,
        name: "Real Estet 4 Komplek B4",
        RealEstateId: 4,
        status: "Inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 10,
        name: "Real Estet 5 Komplek A5",
        RealEstateId: 5,
        status: "Inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 11,
        name: "Real Estet 5 Komplek B5",
        RealEstateId: 5,
        status: "Inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Complexes", null, {});
  },
};
