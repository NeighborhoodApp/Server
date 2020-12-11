const app = require('../app')
const { sequelize } = require('../models')
const request = require('supertest')
const { queryInterface } = sequelize

afterAll(async (done) => {
  try {
    await queryInterface.bulkDelete('Timelines', null, {})
    done()
  } catch (error) {
    done()
  }
})

describe('Test Router Timeline', () => {
  let id = null

  describe('Test endpoint POST /timeline', () => {
    it('201 Success add timeline - should create timeline', async (done) => {
      const res = await request(app).post('/timeline').send({
        description: 'Test',
        image: 'image.jpg',
        privacy: 'public',
        UserId: 1
      })
      const { body, status } = res
      expect(status).toBe(201)
      expect(body).toHaveProperty('description')
      expect(body).toHaveProperty('image')
      expect(body).toHaveProperty('privacy')
      expect(body).toHaveProperty('UserId')
      done()
    })

    it('400 Failed create - should return error if privacy is null', async (done) => {
      const res = await request(app).post('/timeline').send({
        description: 'Test',
        image: 'image.jpg',
        UserId: 1
      })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('error', 'Timeline.privacy cannot be null')
      done()
    })

    it('400 Failed create - should return error if description is empty', async (done) => {
      const res = await request(app).post('/timeline').send({
        description: '',
        image: 'image.jpg',
        privacy: 'public',
        UserId: 1
      })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('error', 'Please enter timeline description')
      done()
    })

    it('400 Failed create - should return error if invalid format privacy ', async (done) => {
      const res = await request(app).post('/timeline').send({
        description: 'Test',
        image: 'image.jpg',
        privacy: 'private',
        UserId: 1
      })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('error', 'Privacy must be public or member')
      done()
    })
  })

  describe('Test endpoint GET /timeline', () => {
    it('200 Succes get timeline - should show timeline', async (done) => {
      const res = await request(app).get('/timeline')
      const { body, status } = res
      expect(status).toBe(200)
      id = body[0].id
      done()
    })
  })

  describe('Test endpoint PUT /timeline', () => {
    it('200 Succes update timeline - should update timeline', async (done) => {
      const res = await request(app).put(`/timeline/${id}`).send({
        description: 'Test update',
        image: 'image.jpg',
        privacy: 'public',
        UserId: 1
      })
      const { body, status } = res
      expect(status).toBe(200)
      expect(body).toHaveProperty('description')
      expect(body).toHaveProperty('image')
      expect(body).toHaveProperty('privacy')
      expect(body).toHaveProperty('UserId')
      done()
    })

    it('400 Failed update - should return error if description is empty', async (done) => {
      const res = await request(app).put(`/timeline/${id}`).send({
        description: '',
        image: 'image.jpg',
        privacy: 'public',
        UserId: 1
      })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('error', 'Please enter timeline description')
      done()
    })

    it('404 Failed update - should return error if invalid id', async (done) => {
      const res = await request(app).put(`/timeline/0`).send({
        description: 'Test update',
        image: 'image.jpg',
        privacy: 'public',
        UserId: 1
      })
      const { body, status } = res
      expect(status).toBe(404)
      expect(body).toHaveProperty('error', 'Timeline not found')
      done()
    })
  })

  describe('Test endpoint DELETE /timeline', () => {
    it('200 Success delete - should delete timeline', async (done) => {
      const res = await request(app).del(`/timeline/${id}`)
      const { body, status } = res
      expect(status).toBe(200)
      expect(body).toBe('Successful deleted timeline')
      done()
    })

    it('404 Failed delete - should delete timeline', async (done) => {
      const res = await request(app).del(`/timeline/0`)
      const { body, status } = res
      expect(status).toBe(404)
      expect(body).toHaveProperty('error', 'Timeline not found')
      done()
    })
  })
})
