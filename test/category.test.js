const app = require('../app')
const { sequelize } = require('../models')
const request = require('supertest')
const { queryInterface } = sequelize

beforeAll(async (done) => {
  const data = [
    {
      category: "Pengajian",
      type: "Event",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      category: "Arisan",
      type: "Event",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      category: "Lainnya",
      type: "Event",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
  try {
    await queryInterface.bulkInsert('Categories', data, {})
    done()
  } catch (error) {
    done()
  }
})

afterAll(async (done) => {
  try {
    await queryInterface.bulkDelete('Events', null, {})
    await queryInterface.bulkDelete('Categories', null, {})
    done()
  } catch (error) {
    done()
  }
})

describe('Test Router Category', () => {
  describe('Test endpoint GET /category', () => {
    it('200 Success get category - should show category', async (done) => {
      const res = await request(app).get('/category')
      const { body, status } = res
      expect(status).toBe(200)
      expect(body[0]).toHaveProperty('category', 'Pengajian')
      done()
    })
  })
})