const app = require('../app')
const { sequelize } = require('../models')
const request = require('supertest')
const { expect, beforeAll } = require('@jest/globals')
const { queryInterface } = sequelize
const Helper = require("../helpers/helper");

let access_token = null
beforeAll(async (done) => {
  const category = [
    {
      category: "Pengajian",
      type: "Event",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  const role = [
    {
      role: "Super Admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      role: "Admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      role: "Warga",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const developer = [
    {
      name: "Developer 1",
      email: "developer1@gmail.com",
      address: "Jl. Alamat Developer 1, Nama Kota",
      RoleId: 1,
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]

  const realestate = [
    {
      name: "Real Estet 1 Perumahan Pematang Sejahtera Plaju",
      address:
        "16 Ulu, Kec. Seberang Ulu II, Kota Palembang, Sumatera Selatan 30111",
      coordinate: "-2.9985332514737544, 104.790206885603",
      DeveloperId: 1,
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]

  const complex = [
    {
      name: "Real Estet 1 Komplek A1",
      RealEstateId: 1,
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]

  const user = [
    {
      email: "warga2@mail.com",
      password: Helper.hashPassword("warga2@mail.com"),
      fullname: "Warga 2",
      address: "Real Estet 1 Alamat Warga",
      RoleId: 3,
      RealEstateId: 1,
      ComplexId: 1,
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]

  try {
    await queryInterface.bulkInsert('Categories', category, {})
    await queryInterface.bulkInsert('Roles', role, {})
    await queryInterface.bulkInsert('Developers', developer, {})
    await queryInterface.bulkInsert('RealEstates', realestate, {})
    await queryInterface.bulkInsert('Complexes', complex, {})
    await queryInterface.bulkInsert('Users', user, {})

    done()
  } catch (error) {
    done()
  }
})

afterAll(async (done) => {
  try {
    await queryInterface.bulkDelete('Categories', null, {})
    await queryInterface.bulkDelete('Events', null, {})
    await queryInterface.bulkDelete('Fees', null, {})
    await queryInterface.bulkDelete('Timelines', null, {})
    await queryInterface.bulkDelete('Comments', null, {})
    await queryInterface.bulkDelete('Roles', null, {})
    await queryInterface.bulkDelete('Developers', null, {})
    await queryInterface.bulkDelete('RealEstates', null, {})
    await queryInterface.bulkDelete('Complexes', null, {})
    await queryInterface.bulkDelete('Users', null, {})
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

describe('Test Router Image', () => {
  describe('Test endpoint POST /upload', () => {
    it('201 Success upload file - should return link', async (done) => {
      const res = await request(app).post('/upload').send({
        file: 'test'
      })
      const { body, status } = res
      expect(status).toBe(201)
      expect(body).toBe('test')
      done()
    })
  })
})

describe('Test Router Event', () => {
  let id = null

  beforeAll(async (done) => {
    const res = await request(app).post('/users/login-client').send({
      email: 'warga2@mail.com',
      password: 'warga2@mail.com'
    })
    console.log(res.body)
    access_token = res.body.access_token
    done()
  })

  describe('Test endpoint POST /event', () => {
    console.log(access_token)
    it('201 Success add event - should create event', async (done) => {
      const res = await request(app).post('/event')
        .set('access_token', access_token)
        .send({
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
      const res = await request(app).post('/event')
        .set('access_token', access_token)
        .send({
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
      const res = await request(app).post('/event')
        .set('access_token', access_token)
        .send({
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
      const res = await request(app).post('/event')
        .set('access_token', access_token)
        .send({
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
      const res = await request(app).post('/event')
        .set('access_token', access_token)
        .send({
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
      const res = await request(app).post('/event')
        .set('access_token', access_token)
        .send({
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

    it('200 Succes get event by id - should show event by id', async (done) => {
      const res = await request(app).get(`/event/${id}`)
      const { body, status } = res
      expect(status).toBe(200)
      expect(body).toHaveProperty('description', 'Test')
      done()
    })

    it('404 Failed get event - should return error if event not found', async (done) => {
      const res = await request(app).get('/event/0')
      const { body, status } = res
      expect(status).toBe(404)
      expect(body).toHaveProperty('msg', 'Event not found')
      done()
    })
  })

  describe('Test endpoint PUT /event', () => {
    it('200 Succes update event - should update event', async (done) => {
      const res = await request(app).put(`/event/${id}`)
        .set('access_token', access_token)
        .send({
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
      const res = await request(app).put(`/event/${id}`)
        .set('access_token', access_token)
        .send({
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
      const res = await request(app).put(`/event/0`)
        .set('access_token', access_token)
        .send({
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

describe('Test Router Fee', () => {
  let id = null

  describe('Test endpoint POST /fee', () => {
    it('201 Success add fee - should create fee', async (done) => {
      const res = await request(app).post('/fee')
        .set('access_token', access_token)
        .send({
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
      const res = await request(app).post('/fee')
        .set('access_token', access_token)
        .send({
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
      const res = await request(app).post('/fee')
        .set('access_token', access_token)
        .send({
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
      const res = await request(app).post('/fee')
        .set('access_token', access_token)
        .send({
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
      const res = await request(app).post('/fee')
        .set('access_token', access_token)
        .send({
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
      const res = await request(app).post('/fee')
        .set('access_token', access_token)
        .send({
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
      const res = await request(app).put(`/fee/${id}`)
        .set('access_token', access_token)
        .send({
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
      const res = await request(app).put(`/fee/${id}`)
        .set('access_token', access_token)
        .send({
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
      const res = await request(app).put(`/fee/0`)
        .set('access_token', access_token)
        .send({
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

describe('Test Router Timeline', () => {
  let id = null

  describe('Test endpoint POST /timeline', () => {
    it('201 Success add timeline - should create timeline', async (done) => {
      const res = await request(app).post('/timeline')
        .set('access_token', access_token)
        .send({
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
      const res = await request(app).post('/timeline')
        .set('access_token', access_token)
        .send({
          description: 'Test',
          image: 'image.jpg',
          UserId: 1
        })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('msg', 'Timeline.privacy cannot be null')
      done()
    })

    it('400 Failed create - should return error if description is empty', async (done) => {
      const res = await request(app).post('/timeline')
        .set('access_token', access_token)
        .send({
          description: '',
          image: 'image.jpg',
          privacy: 'public',
          UserId: 1
        })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('msg', 'Please enter timeline description')
      done()
    })

    it('400 Failed create - should return error if invalid format privacy ', async (done) => {
      const res = await request(app).post('/timeline')
        .set('access_token', access_token)
        .send({
          description: 'Test',
          image: 'image.jpg',
          privacy: 'private',
          UserId: 1
        })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('msg', 'Privacy must be public or member')
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

    it('200 Succes get timeline by id - should show timeline by id', async (done) => {
      const res = await request(app).get(`/timeline/${id}`)
      const { body, status } = res
      expect(status).toBe(200)
      expect(body).toHaveProperty('description', 'Test')
      done()
    })

    it('404 Failed get timeline - should return error if timeline not found', async (done) => {
      const res = await request(app).get('/timeline/0')
      const { body, status } = res
      expect(status).toBe(404)
      expect(body).toHaveProperty('msg', 'Timeline not found')
      done()
    })
  })

  describe('Test endpoint PUT /timeline', () => {
    it('200 Succes update timeline - should update timeline', async (done) => {
      const res = await request(app).put(`/timeline/${id}`)
        .set('access_token', access_token)
        .send({
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
      const res = await request(app).put(`/timeline/${id}`)
        .set('access_token', access_token)
        .send({
          description: '',
          image: 'image.jpg',
          privacy: 'public',
          UserId: 1
        })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('msg', 'Please enter timeline description')
      done()
    })

    it('404 Failed update - should return error if invalid id', async (done) => {
      const res = await request(app).put(`/timeline/0`)
        .set('access_token', access_token)
        .send({
          description: 'Test update',
          image: 'image.jpg',
          privacy: 'public',
          UserId: 1
        })
      const { body, status } = res
      expect(status).toBe(404)
      expect(body).toHaveProperty('msg', 'Timeline not found')
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
      expect(body).toHaveProperty('msg', 'Timeline not found')
      done()
    })
  })
})

describe('Test Router Comment', () => {
  let id = null

  describe('Test endpoint POST /comment', () => {
    it('201 Success add comment - should create comment', async (done) => {
      const res = await request(app).post('/comment')
        .set('access_token', access_token)
        .send({
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
      const res = await request(app).post('/comment')
        .set('access_token', access_token)
        .send({
          comment: 'Test',
          UserId: 1,
        })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('msg', 'Comment.TimelineId cannot be null')
      done()
    })

    it('400 Failed create - should return error if comment is empty', async (done) => {
      const res = await request(app).post('/comment')
        .set('access_token', access_token)
        .send({
          comment: '',
          UserId: 1,
          TimelineId: 1,
        })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('msg', 'Please enter your comment')
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

    it('200 Succes get comment by id - should show comment by id', async (done) => {
      const res = await request(app).get(`/comment/${id}`)
      const { body, status } = res
      expect(status).toBe(200)
      expect(body).toHaveProperty('comment', 'Test')
      done()
    })

    it('404 Failed get comment - should return error if comment not found', async (done) => {
      const res = await request(app).get('/comment/0')
      const { body, status } = res
      expect(status).toBe(404)
      expect(body).toHaveProperty('msg', 'Comment not found')
      done()
    })
  })

  describe('Test endpoint PUT /comment', () => {
    it('200 Succes update comment - should update comment', async (done) => {
      const res = await request(app).put(`/comment/${id}`)
        .set('access_token', access_token)
        .send({
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
      const res = await request(app).put(`/comment/${id}`)
        .set('access_token', access_token)
        .send({
          comment: '',
          UserId: 1,
          TimelineId: 1,
        })
      const { body, status } = res
      expect(status).toBe(400)
      expect(body).toHaveProperty('msg', 'Please enter your comment')
      done()
    })

    it('404 Failed update - should return error if invalid id', async (done) => {
      const res = await request(app).put(`/comment/0`)
        .set('access_token', access_token)
        .send({
          comment: 'Test update',
          UserId: 1,
          TimelineId: 1,
        })
      const { body, status } = res
      expect(status).toBe(404)
      expect(body).toHaveProperty('msg', 'Comment not found')
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
      expect(body).toHaveProperty('msg', 'Comment not found')
      done()
    })
  })
})