'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = [
      {
        description:
          "Ada yang liat kucing aku ngga ya? Aku sedih sekali udah cari kemana-mana ga ketemu",
        image:
          "https://mk0punsjokesui4twax7.kinstacdn.com/wp-content/uploads/2020/05/cute-cat.jpg",
        privacy: "public",
        UserId: 49,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Timelines", data, {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Timelines", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
