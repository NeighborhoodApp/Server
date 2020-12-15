if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require('express')
const PORT = 3000
const app = express()
const cors = require('cors')
const routes = require('./routes')
const Middleware = require("./middlewares/middleware")
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", routes);
app.use(Middleware.errorHandler);

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('new comment', ({name,comment}) => {
    io.emit('comment', {name, comment})
  });
});

http.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT)
})

module.exports = app;
