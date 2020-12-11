const app = require('../app')
const { sequelize } = require('../models')
const request = require('supertest')
const { queryInterface } = sequelize

afterAll(async (done) => {
  try {
    await queryInterface.bulkDelete('Comments', null, {})
    done()
  } catch (error) {
    done()
  }
})

describe('Test Router Comment', () => {
  let id = null

  describe('Test endpoint POST /comment', () => {
    it('201 Success add comment - should create comment', async (done) => {
      const res = await request(app).post('/comment').send({
        comment: 'Test',
        UserId: 1,
        TimelineId: 1,
      })
      const { body, status } = res
      expect(status).toBe(201)
      expect(body).toHaveProperty('comment')
      expect(body).toHaveProperty('UserId')
      expect(body).toHaveProperty('TimelineId')
      done()
    })

    it('400 Failed create - should return error if timeline is null', async (done) => {
      const res = await request(app).post('/comment').send({
        comment: 'Test',
        UserId: 1,
      })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('error', 'Comment.TimelineId cannot be null')
      done()
    })

    it('400 Failed create - should return error if comment is empty', async (done) => {
      const res = await request(app).post('/comment').send({
        comment: '',
        UserId: 1,
        TimelineId: 1,
      })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('error', 'Please enter your comment')
      done()
    })
  })

  describe('Test endpoint GET /comment', () => {
    it('200 Succes get comment - should show comment', async (done) => {
      const res = await request(app).get('/comment')
      const { body, status } = res
      expect(status).toBe(200)
      id = body[0].id
      done()
    })
  })

  describe('Test endpoint PUT /comment', () => {
    it('200 Succes update comment - should update comment', async (done) => {
      const res = await request(app).put(`/comment/${id}`).send({
        comment: 'Test update',
        UserId: 1,
        TimelineId: 1,
      })
      const { body, status } = res
      expect(status).toBe(200)
      expect(body).toHaveProperty('comment')
      expect(body).toHaveProperty('UserId')
      expect(body).toHaveProperty('TimelineId')
      done()
    })

    it('400 Failed update - should return error if comment is empty', async (done) => {
      const res = await request(app).put(`/comment/${id}`).send({
        comment: '',
        UserId: 1,
        TimelineId: 1,
      })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('error', 'Please enter your comment')
      done()
    })

    it('404 Failed update - should return error if invalid id', async (done) => {
      const res = await request(app).put(`/comment/0`).send({
        comment: 'Test update',
        UserId: 1,
        TimelineId: 1,
      })
      const { body, status } = res
      expect(status).toBe(404)
      expect(body).toHaveProperty('error', 'Comment not found')
      done()
    })
  })

  describe('Test endpoint DELETE /comment', () => {
    it('200 Success delete - should delete comment', async (done) => {
      const res = await request(app).del(`/comment/${id}`)
      const { body, status } = res
      expect(status).toBe(200)
      expect(body).toBe('Successful deleted comment')
      done()
    })

    it('404 Failed delete - should delete comment', async (done) => {
      const res = await request(app).del(`/comment/0`)
      const { body, status } = res
      expect(status).toBe(404)
      expect(body).toHaveProperty('error', 'Comment not found')
      done()
    })
  })
})
