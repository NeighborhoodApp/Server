const app = require("../app.js");
const request = require("supertest");
const io = require("socket.io-client")
const testMsg = "HelloWorld"
let sender, receiver

describe("Chat Events", function () {
  beforeEach(function (done) {
    // start the io server
    // server.start();
    // connect two io clients
    sender = io("http://localhost:3000/");
    receiver = io("http://localhost:3000/");

    // finish beforeEach setup
    done();
  });
  afterEach(function (done) {
    // disconnect io clients after each test
    sender.disconnect();
    receiver.disconnect();
    done();
  });

  describe("Message Events", function () {
    it("Clients should receive a message when the `message` event is emited.", function (done) {
      sender.emit("comment", testMsg);
      receiver.on("new comment", function (msg) {
        expect(msg).toEqual(testMsg);
        done();
      });
      done()
    });
  });
});