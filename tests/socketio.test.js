const io = require("socket.io-client")
const testMsg = "HelloWorld"
let socket
beforeAll(done => {
  socket = io('http://localhost:3000')

  socket.emit('new comment', { comment: testMsg })
  done()
})

describe('Test endpoint Socket.io', () => {
  it('success', (done) => {
    socket.on('comment', ({ comment }) => {
      expect(comment).toBe(testMsg)
    })
    done()
  })

})