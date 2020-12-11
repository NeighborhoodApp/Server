"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("RealEstates", [
      {
        id: 1,
        name: "Real Estet 1 Perumahan Pematang Sejahtera Plaju",
        address:
          "16 Ulu, Kec. Seberang Ulu II, Kota Palembang, Sumatera Selatan 30111",
        coordinate: "-2.9985332514737544, 104.790206885603",
        DeveloperId: 1,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Real Estet 2 Komplek Jaya Permai",
        address:
          "16 Ulu, Kec. Seberang Ulu II, Kota Palembang, Sumatera Selatan 30111",
        coordinate: "-2.999220773018713, 104.79017833687155",
        DeveloperId: 2,
        status: "Inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "Real Estet 3 Perumahan Kenanga Indah Residence",
        address:
          "Lrg. Kenanga, 16 Ulu, Kec. Seberang Ulu II, Kota Palembang, Sumatera Selatan 30118",
        coordinate: "-2.99680540751585, 104.79376145421122",
        DeveloperId: 2,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: "Real Estet 4 Green Plaju Estate",
        address:
          "Lrg. Ilham, RT.070/RW.006, Kel. 16, Kec. Seberang Ulu II, Palembang Ulu, Sumatera Selatan 30265",
        coordinate: "-2.996095373430308, 104.79039816125677",
        DeveloperId: 3,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: "Real Estet 5 Perumahan griya indah 7",
        address:
          "Jln. Ahmad yani ( belakang jm plaju, 16 Ulu, Kec. Seberang Ulu II, Kota Palembang, Sumatera Selatan 30111",
        coordinate: "-2.991282145902664, 104.79348846335574",
        DeveloperId: 3,
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
