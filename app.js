if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require('express')
const PORT = process.env.PORT || 3000;
const app = express()
const cors = require('cors')
const routes = require('./routes')
const Middleware = require("./middlewares/middleware")
const http = require("http").createServer(app)
const io = require("socket.io")(http)
const path = require('path')

app.use(cors());
app.use(express.static(path.join(__dirname, "../../build"))); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", routes);
app.use(Middleware.errorHandler);
/* istanbul ignore next */
io.on('connection', (socket) => {
  console.log(socket.id, 'connect')
  socket.on('join', id => {
    console.log(socket.id, 'joined id', id)
    socket.join(id)
  })
  socket.on('new comment', ({id, name,comment,img}) => {
    console.log(id, name,comment,img)
    io.in(id).emit('comment', {name, comment, img})
  });
  socket.on('dc', (id) => {
    console.log(socket.id, 'leaved id', id)
    socket.leave(id)
  });
  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnected');
    socket.leaveAll()
  });
});

http.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT)
})

module.exports = app;
