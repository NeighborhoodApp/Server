"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("RealEstates", [
      {
        name: "Citra Lamb 1",
        address: "Jl. Pasir Kuda, No12, Bandung",
        coordinate: "-2.9985332514737544, 104.790206885603",
        DeveloperId: "1",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Citra Lamb 2",
        address: "Jl. Pasir Patiih, No13, Bandung",
        coordinate: "-2.9985332514737544, 104.790206885603",
        DeveloperId: "1",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sedaya Grup A",
        address: "Jl. Tanjung Pasir No14, Bandung",
        coordinate: "-2.9985332514737544, 104.790206885603",
        DeveloperId: "2",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sedaya Grup B",
        address: "Jl. Jati Baru, No12, Bandung",
        coordinate: "-2.9985332514737544, 104.790206885603",
        DeveloperId: "2",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Padamara Land 1",
        address: "Jl. Jati Nagor No 100, Bandung",
        coordinate: "-2.9985332514737544, 104.790206885603",
        DeveloperId: "3",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Padamara Land 2",
        address: "Jl. Malaka, No 13, Bandung",
        coordinate: "-2.9985332514737544, 104.790206885603",
        DeveloperId: "3",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Citra Lamb 1",
        address: "Jl. Sudirman No 22, Bandung",
        coordinate: "-2.9985332514737544, 104.790206885603",
        DeveloperId: "4",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("RealEstates", null, {});
  },
};
