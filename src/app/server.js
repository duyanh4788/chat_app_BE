require("dotenv").config();
const express = require("express");
const app = express();
const httpServer = require("http").Server(app);
const mongoose = require("mongoose");
const cors = require("cors");
const io = require("socket.io")(httpServer);
require("../socket_io/socket_io")(io);
const { userRouter } = require("../routers/user.api");
const { messageRouter } = require("../routers/message.api");
const { convertStationRouter } = require("../routers/convertStation.api");

/* Config Data Base */
const DATA_MONGO = process.env.DATABASE;
mongoose
  .connect(DATA_MONGO)
  .then(() => {
    console.log("DB connecttion success");
  })
  .catch((err) => console.log(err));
/* Config Data Base */

/* Config Request to JSON CORS*/
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
/* Config Request to JSON CORS*/

/*Config API */
app.use(express());
app.get('/', (req, res) => {
  res.send('Wellcome PJ_TEST');
});
app.use("/api/v1", userRouter);
app.use("/api/v1", messageRouter);
app.use("/api/v1", convertStationRouter);

const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
  console.log(`Api on port : ${port}`);
});
