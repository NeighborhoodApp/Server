const app = require('../app')
const { sequelize } = require('../models')
const request = require('supertest')
const { queryInterface } = sequelize

afterAll(async (done) => {
  try {
    await queryInterface.bulkDelete('Categories', null, {})
    done()
  } catch (error) {
    done()
  }
})

describe('Test Router Event', () => {
  let id = null

  describe('Test endpoint POST /event', () => {
    it('201 Success add event - should create event', async (done) => {
      const res = await request(app).post('/event').send({
        name: 'Test event pengajian',
        description: 'Test',
        image: '/image',
        date: '2020-12-30',
        CategoryId: 1,
        UserId: 1,
        RealEstateId: 1
      })
      const { body, status } = res
      expect(status).toBe(201)
      expect(body).toHaveProperty('name')
      expect(body).toHaveProperty('description')
      expect(body).toHaveProperty('image')
      expect(body).toHaveProperty('date')
      expect(body).toHaveProperty('CategoryId')
      expect(body).toHaveProperty('UserId')
      expect(body).toHaveProperty('RealEstateId')
      done()
    })

    it('400 Failed create - should return error if category is null', async (done) => {
      const res = await request(app).post('/event').send({
        name: 'Test event pengajian',
        description: 'Test',
        image: '/image',
        date: '2020-12-30',
        UserId: 1,
        RealEstateId: 1
      })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('msg', 'Event.CategoryId cannot be null')
      done()
    })

    it('400 Failed create - should return error if name is empty', async (done) => {
      const res = await request(app).post('/event').send({
        name: '',
        description: 'Test',
        image: '/image',
        date: '2020-12-30',
        CategoryId: 1,
        UserId: 1,
        RealEstateId: 1
      })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('msg', 'Please enter event name')
      done()
    })

    it('400 Failed create - should return error if date has passed', async (done) => {
      const res = await request(app).post('/event').send({
        name: 'Test event pengajian',
        description: 'Test',
        image: '/image',
        date: '2020-12-10',
        CategoryId: 1,
        UserId: 1,
        RealEstateId: 1
      })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('msg', 'Date must be greater than today')
      done()
    })

    it('400 Failed create - should return error if date invalid format', async (done) => {
      const res = await request(app).post('/event').send({
        name: 'Test event pengajian',
        description: 'Test',
        image: '/image',
        date: '2020-13-10',
        CategoryId: 1,
        UserId: 1,
        RealEstateId: 1
      })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('msg', 'Please enter valid date')
      done()
    })

    it('400 Failed create - should return error if real estate is empty', async (done) => {
      const res = await request(app).post('/event').send({
        name: 'Test event pengajian',
        description: 'Test',
        image: '/image',
        date: '2020-12-30',
        CategoryId: 1,
        UserId: 1,
        RealEstateId: ''
      })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('msg', 'Pleasse select your real estate, Please enter valid real estate')
      done()
    })
  })

  describe('Test endpoint GET /event', () => {
    it('200 Succes get event - should show event', async (done) => {
      const res = await request(app).get('/event')
      const { body, status } = res
      expect(status).toBe(200)
      id = body[0].id
      done()
    })
  })

  describe('Test endpoint PUT /event', () => {
    it('200 Succes update event - should update event', async (done) => {
      const res = await request(app).put(`/event/${id}`).send({
        name: 'Test update event pengajian',
        description: 'Test',
        image: '/image',
        date: '2020-12-30',
        CategoryId: 1,
        UserId: 1,
        RealEstateId: 1
      })
      const { body, status } = res
      expect(status).toBe(200)
      expect(body).toHaveProperty('name')
      expect(body).toHaveProperty('description')
      expect(body).toHaveProperty('image')
      expect(body).toHaveProperty('date')
      expect(body).toHaveProperty('CategoryId')
      expect(body).toHaveProperty('UserId')
      expect(body).toHaveProperty('RealEstateId')
      done()
    })

    it('400 Failed update - should return error if name is empty', async (done) => {
      const res = await request(app).put(`/event/${id}`).send({
        name: '',
        description: 'Test',
        image: '/image',
        date: '2020-12-30',
        CategoryId: 1,
        UserId: 1,
        RealEstateId: 1
      })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('msg', 'Please enter event name')
      done()
    })

    it('404 Failed update - should return error if invalid id', async (done) => {
      const res = await request(app).put(`/event/0`).send({
        name: 'Test',
        description: 'Test',
        image: '/image',
        date: '2020-12-30',
        CategoryId: 1,
        UserId: 1,
        RealEstateId: 1
      })
      const { body, status } = res
      expect(status).toBe(404)
      expect(body).toHaveProperty('msg', 'Event not found')
      done()
    })
  })

  describe('Test endpoint DELETE /event', () => {
    it('200 Success delete - should delete event', async (done) => {
      const res = await request(app).del(`/event/${id}`)
      const { body, status } = res
      expect(status).toBe(200)
      expect(body).toBe('Successful deleted event')
      done()
    })

    it('404 Failed delete - should delete event', async (done) => {
      const res = await request(app).del(`/event/0`)
      const { body, status } = res
      expect(status).toBe(404)
      expect(body).toHaveProperty('msg', 'Event not found')
      done()
    })
  })
})
