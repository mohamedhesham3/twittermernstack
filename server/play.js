const express = require("express");
const app = express();
const Router = require("./Routes/AuthRoute");
const cors = require("cors"); 
const mongoose = require("./confgis/mongoose");
const bodyParser = require("body-parser");
const http = require("http"); 
const socketIo = require("socket.io");
const {likes} =require('./Controllers/Post');
require("dotenv").config();

const { realtimechat } = require("./Controllers/Chat");
const port = process.env.PORT;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = {
  origin: 'https://6674a2d870b58fd0559eb418--golden-moonbeam-c7d3c6.netlify.app',
  credentials: true, 
};

app.use(cors(corsOptions));
app.use("/", Router);
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://6674a2d870b58fd0559eb418--golden-moonbeam-c7d3c6.netlify.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
likes(io)
realtimechat(io)



server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
