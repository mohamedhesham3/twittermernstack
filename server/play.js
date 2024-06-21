const express = require("express");
const app = express();
const Router = require("./Routes/AuthRoute");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");
const { likes } = require("./Controllers/Post");
const mongoose=require('./confgis/mongoose')
require("dotenv").config();
const { realtimechat } = require("./Controllers/Chat");

const port = process.env.PORT;
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ origin: "*"}));

app.use("/", Router);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

likes(io);
realtimechat(io);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
