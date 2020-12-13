const app = require('../app')
const { sequelize } = require('../models')
const request = require('supertest')
const { queryInterface } = sequelize

afterAll(async (done) => {
  try {
    await queryInterface.bulkDelete('Fees', null, {})
    done()
  } catch (error) {
    done()
  }
})

describe('Test Router Fee', () => {
  let id = null

  describe('Test endpoint POST /fee', () => {
    it('201 Success add fee - should create fee', async (done) => {
      const res = await request(app).post('/fee').send({
        name: 'Test fee pengajian',
        description: 'Test',
        due_date: '2020-12-30',
        RealEstateId: 1,
        ComplexId: 1
      })
      const { body, status } = res
      expect(status).toBe(201)
      expect(body).toHaveProperty('name')
      expect(body).toHaveProperty('description')
      expect(body).toHaveProperty('due_date')
      expect(body).toHaveProperty('RealEstateId')
      expect(body).toHaveProperty('ComplexId')
      done()
    })

    it('400 Failed create - should return error if complex is null', async (done) => {
      const res = await request(app).post('/fee').send({
        name: 'Test fee pengajian',
        description: 'Test',
        due_date: '2020-12-30',
        RealEstateId: 1,
      })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('msg', 'Fee.ComplexId cannot be null')
      done()
    })

    it('400 Failed create - should return error if name is empty', async (done) => {
      const res = await request(app).post('/fee').send({
        name: '',
        description: 'Test',
        due_date: '2020-12-30',
        RealEstateId: 1,
        ComplexId: 1
      })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('msg', 'Please enter fees name')
      done()
    })

    it('400 Failed create - should return error if date has passed', async (done) => {
      const res = await request(app).post('/fee').send({
        name: 'Test fee pengajian',
        description: 'Test',
        due_date: '2020-12-3',
        RealEstateId: 1,
        ComplexId: 1
      })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('msg', 'Date must be greater than today')
      done()
    })

    it('400 Failed create - should return error if date invalid format', async (done) => {
      const res = await request(app).post('/fee').send({
        name: 'Test fee pengajian',
        description: 'Test',
        due_date: '2020-13-30',
        RealEstateId: 1,
        ComplexId: 1
      })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('msg', 'Please enter valid date')
      done()
    })

    it('400 Failed create - should return error if real estate is empty', async (done) => {
      const res = await request(app).post('/fee').send({
        name: 'Test fee pengajian',
        description: 'Test',
        due_date: '2020-12-30',
        RealEstateId: '',
        ComplexId: 1
      })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('msg', 'Pleasse select your real estate, Please enter valid real estate')
      done()
    })
  })

  describe('Test endpoint GET /fee', () => {
    it('200 Succes get fee - should show fee', async (done) => {
      const res = await request(app).get('/fee')
      const { body, status } = res
      expect(status).toBe(200)
      id = body[0].id
      done()
    })

    it('200 Succes get fee by id - should show fee by id', async (done) => {
      const res = await request(app).get(`/fee/${id}`)
      const { body, status } = res
      expect(status).toBe(200)
      expect(body).toHaveProperty('name', 'Test fee pengajian')
      done()
    })

    it('404 Failed get fee - should return error if fee not found', async (done) => {
      const res = await request(app).get('/fee/0')
      const { body, status } = res
      expect(status).toBe(404)
      expect(body).toHaveProperty('msg', 'Fee not found')
      done()
    })
  })

  describe('Test endpoint PUT /fee', () => {
    it('200 Succes update fee - should update fee', async (done) => {
      const res = await request(app).put(`/fee/${id}`).send({
        name: 'Test update fee pengajian',
        description: 'Test',
        due_date: '2020-12-30',
        RealEstateId: 1,
        ComplexId: 1
      })
      const { body, status } = res
      expect(status).toBe(200)
      expect(body).toHaveProperty('name')
      expect(body).toHaveProperty('description')
      expect(body).toHaveProperty('due_date')
      expect(body).toHaveProperty('RealEstateId')
      expect(body).toHaveProperty('ComplexId')
      done()
    })

    it('400 Failed update - should return error if name is empty', async (done) => {
      const res = await request(app).put(`/fee/${id}`).send({
        name: '',
        description: 'Test',
        due_date: '2020-12-30',
        RealEstateId: 1,
        ComplexId: 1
      })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('msg', 'Please enter fees name')
      done()
    })

    it('404 Failed update - should return error if invalid id', async (done) => {
      const res = await request(app).put(`/fee/0`).send({
        name: 'Test update fee pengajian',
        description: 'Test',
        due_date: '2020-12-30',
        RealEstateId: 1,
        ComplexId: 1
      })
      const { body, status } = res
      expect(status).toBe(404)
      expect(body).toHaveProperty('msg', 'Fee not found')
      done()
    })
  })

  describe('Test endpoint DELETE /fee', () => {
    it('200 Success delete - should delete fee', async (done) => {
      const res = await request(app).del(`/fee/${id}`)
      const { body, status } = res
      expect(status).toBe(200)
      expect(body).toBe('Successful deleted fees')
      done()
    })

    it('404 Failed delete - should delete fee', async (done) => {
      const res = await request(app).del(`/fee/0`)
      const { body, status } = res
      expect(status).toBe(404)
      expect(body).toHaveProperty('msg', 'Fee not found')
      done()
    })
  })
})
