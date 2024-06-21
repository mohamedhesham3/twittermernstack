const express = require("express");
const app = express();
const Router = require("./Routes/AuthRoute");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");
const { likes } = require('./Controllers/Post');
require("dotenv").config();

const { realtimechat } = require("./Controllers/Chat");
const port = process.env.PORT 

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const corsOptions = {
  origin: 'https://twittermernstack.vercel.app',
};
app.use(cors(corsOptions));

// Routes
app.use("/", Router);


// WebSocket setup
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://twittermernstack.vercel.app",
    methods: ["GET", "POST"]
  },
});

likes(io); 
realtimechat(io);

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
