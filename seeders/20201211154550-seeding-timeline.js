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
        description: "This is test timelines by warga 1",
        image: "images/imageurl.jpg",
        privacy: "public",
        UserId: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        description: "This is test timelines by warga 3",
        image: "images/imageurl.jpg",
        privacy: "member",
        UserId: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    await queryInterface.bulkInsert('Timelines', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Timelines', null, {})
  }
};
