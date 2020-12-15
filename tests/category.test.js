const app = require("../app");
const { sequelize } = require("../models");
const request = require("supertest");
const { queryInterface } = sequelize;

beforeAll(async (done) => {
  const category = [
    {
      category: "Pengajian",
      type: "Event",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  try {
    await queryInterface.bulkInsert('Categories', category, {})
    done()
  } catch (error) {
    done()
  }
})

afterAll(async (done) => {
  try {
    await queryInterface.bulkDelete("Categories", {});
    done();
  } catch (error) {
    done();
  }
});

describe('Test Router Category', () => {
  describe('Test endpoint GET /category', () => {
    it('200 Success get category - should show category', async (done) => {
      const res = await request(app).get('/category')
      const { body, status } = res
      expect(status).toBe(200)
      expect(body[0]).toHaveProperty('category', 'Pengajian')
      expect(body[0]).toHaveProperty('Events')
      await queryInterface.bulkDelete('Categories', null, {})
      done()
    })

    it('404 Failed get category - should return error if category is empty', async (done) => {
      const res = await request(app).get('/category')
      const { body, status } = res
      expect(status).toBe(404)
      expect(body).toHaveProperty('msg', 'Category not found')
      done()
    })
  })
})
