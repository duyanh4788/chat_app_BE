const express = require("express");
const app = express();
const httpServer = require("http").Server(app);
const mongoose = require("mongoose");
const cors = require("cors");
const { userRouter } = require("./src/routers/user.api");
const { messageRouter } = require("./src/routers/message.api");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const io = require("socket.io")(httpServer);
const Filter = require("bad-words");
const {
  createMessageSocket,
  renderMessageSocket,
} = require("./src/utils/createMessageSocket");
const {
  getUserList,
  addUserList,
  removeUserList,
} = require("./src/utils/createUsers");
const { createMessageMG } = require("./src/controllers/message.controller");
const { SOCKET_COMMIT, TEXT_BAD } = require("./src/common/common.constants");

/* Config Data Base */
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
const localDB = "mongodb://localhost:27017/chatApp";
mongoose
  .connect(localDB)
  .then(() => {
    console.log("DB connecttion success");
  })
  .catch((err) => console.log(err));
/* Config Data Base */

/* Config Request to JSON */
app.use(express.json());
app.options("*", cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(cors());
/* Config Request to JSON */

/* Socket IO */
io.on(SOCKET_COMMIT.CONNECT, (socket) => {
  /**reciver join room */
  socket.on(SOCKET_COMMIT.JOIN_ROOM, ({ fullName, room, account, uid }) => {
    socket.join(room);
    /** add client join room */
    io.to(room).emit(SOCKET_COMMIT.ADD_CLIENT_JOIN_ROOM, addUserList(uid));
    /** notify */
    socket.emit(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, `Hello ${fullName}`);
    /** send message to new client after join */
    socket.broadcast
      .to(room)
      .emit(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, `${fullName} Joining`);
    /** render client inside room */
    io.to(room).emit(
      SOCKET_COMMIT.SEND_LIST_CLIENT,
      getUserList({ room, fullName, account })
    );
    /** chat */
    socket.on(SOCKET_COMMIT.SEND_MESSAGE, (message, callBackAcknow) => {
      createMessageMG({ message, account, fullName, uid });
      const filter = new Filter();
      filter.addWords(...TEXT_BAD);
      // const sendSuccess = 200;
      if (filter.isProfane(message)) {
        let returnText = filter.clean(message);
        io.to(room).emit(SOCKET_COMMIT.SEND_MESSAGE, renderMessageSocket(returnText));
        return callBackAcknow(SOCKET_COMMIT.MESSAGE_NOT_AVALID);
      }
      // save database
      io.to(room).emit(
        SOCKET_COMMIT.SEND_MESSAGE,
        createMessageSocket({ message, account, fullName, uid })
      );
      io.to(room).emit(
        SOCKET_COMMIT.SEND_ARRAY_MESSAGE,
        renderMessageSocket({ message, account, fullName, uid })
      );
      callBackAcknow();
    });
    /** location */
    socket.on(SOCKET_COMMIT.SEND_LOCATION, (location) => {
      if (location) {
        const linkLocation = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
        io.to(room).emit(SOCKET_COMMIT.SERVER_SEND_LOCATION, linkLocation);
        io.to(room).emit(
          SOCKET_COMMIT.SEND_ARRAY_MESSAGE,
          renderMessageSocket({ message: linkLocation, account, fullName })
        );
      }
    });

    /**disconnect socket io */
    socket.on(SOCKET_COMMIT.DISCONNECT, () => {
      removeUserList(socket.id);
      /** render client inside room */
      io.to(room).emit(
        SOCKET_COMMIT.SEND_LIST_CLIENT,
        getUserList({ room, fullName, account })
      );
    });
  });
});
/* Socket IO */

/*Config API */
app.use(express());
app.use("/api/v1", userRouter);
app.use("/api/v1", messageRouter);
const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
  console.log(`Well Come App Chat_Socket_IO on port : ${port}`);
});
