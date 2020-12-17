"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Complexes", [
      {
        name: "Komplek Gajah Mada",
        RealEstateId: "1",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Komplek Kayu Batu",
        RealEstateId: "1",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Komplek Maja Pahit 1",
        RealEstateId: "2",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Komplek Maja Pahit 2",
        RealEstateId: "2",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Komplek Jati Asih",
        RealEstateId: "3",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Komplek Maskarebet",
        RealEstateId: "3",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Komplek Tanjung Mas",
        RealEstateId: "1",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Complexes", null, {});
  },
};
