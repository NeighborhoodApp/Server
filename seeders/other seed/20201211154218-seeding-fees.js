'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const data = [
      {
        name: "Iuran Kebersihan",
        description: "Description of iuran kebersihan",
        due_date: "2020-12-27T00:00:00.000Z",
        RealEstateId: 1,
        ComplexId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Iuran Keamanan",
        description: "Description of iuran keamanan",
        due_date: "2020-12-20T00:00:00.000Z",
        RealEstateId: 1,
        ComplexId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Iuran Kas",
        description: "Description of iuran kas",
        due_date: "2020-12-27T00:00:00.000Z",
        RealEstateId: 1,
        ComplexId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    await queryInterface.bulkInsert('Fees', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Fees', null, {})
  }
};
