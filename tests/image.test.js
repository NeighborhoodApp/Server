const app = require("../app");
const request = require("supertest");
const filePath = `/home/samudra/Documents/Hactiv8/Final-Project/Server/tests/test.txt`;

describe('Test Router Image', () => {
  describe('Test endpoint POST /upload', () => {
    it('201 Success upload file - should return link', async (done) => {
      const res = await request(app).post('/upload')
        .attach('file', filePath)
      const { body, status } = res
      console.log(body)
      expect(status).toBe(201)
      done()
    })
  })
})
