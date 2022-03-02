const express = require("express");
const app = express();
const httpServer = require("http").Server(app);
const mongoose = require("mongoose");
const cors = require("cors");
const { userRouter } = require("./app/src/routers/user.api");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const io = require("socket.io")(httpServer);
const Filter = require("bad-words");
const {
  createMessage,
  renderMessage,
} = require("./app/src/utils/create-message");
const {
  getUserList,
  addUserList,
  removeUserList,
} = require("./app/src/utils/users");

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
io.on("connection", (socket) => {
  /**reciver join room */
  socket.on("join room", ({ fullName, room, account, uid }) => {
    socket.join(room);
    /** add client join room */
    io.to(room).emit("add client join room", addUserList(uid));
    /** notify */
    socket.emit(
      "send message notify",
      `Well Come ${fullName} Join Room ${room}`
    );
    /** send message to new client after join */
    socket.broadcast
      .to(room)
      .emit("send message notify", `${fullName} Joining`);
    /** render client inside room */
    io.to(room).emit(
      "send list client inside room",
      getUserList({ room, fullName, account })
    );

    /** chat */
    socket.on("send message", (message, callBackAcknow) => {
      const filter = new Filter();
      const textBad = ["con cặc", "địt mẹ", "đụ má", "chó đẻ", "cặc"];
      filter.addWords(...textBad);
      // const sendSuccess = 200;
      if (filter.isProfane(message)) {
        let returnText = filter.clean(message);
        io.to(room).emit("send message", renderMessage(returnText));
        return callBackAcknow("Message Not Available");
      }
      // save database
      io.to(room).emit(
        "send message",
        createMessage({ message, account, fullName, uid })
      );
      io.to(room).emit(
        "send array message",
        renderMessage({ message, account, fullName, uid })
      );
      callBackAcknow();
    });
    /** location */
    socket.on("send location", (location) => {
      if (location) {
        const linkLocation = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
        io.to(room).emit("server send location", linkLocation);
        io.to(room).emit(
          "send array message",
          renderMessage({ message: linkLocation, account, fullName })
        );
      }
    });

    /**disconnect socket io */
    socket.on("disconnect", () => {
      removeUserList(socket.id);
      /** render client inside room */
      io.to(room).emit(
        "send list client inside room",
        getUserList({ room, fullName, account })
      );
    });
  });
});
/* Socket IO */

/*Config API */
app.use(express());
app.use("/api/v1", userRouter);
const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
  console.log(`Well Come App Chat_Socket_IO on port : ${port}`);
});
