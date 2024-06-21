const express = require("express");
const app = express();
const Router = require("./Routes/AuthRoute");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");
const { likes } = require('./Controllers/Post');
require("dotenv").config();

const { realtimechat } = require("./Controllers/Chat");
const port = process.env.PORT || 5000; // Use a default port if PORT environment variable is not set

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Middleware to handle CORS
const corsOptions = {
  origin: 'http://localhost:5173/',
};
app.use(cors(corsOptions));

// Routes
app.use("/", Router);

// Serve index.html for all other routes to enable client-side routing
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// WebSocket setup
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://6674a2d870b58fd0559eb418--golden-moonbeam-c7d3c6.netlify.app",
    methods: ["GET", "POST"]
  },
});

// Initialize socket.io handlers
likes(io); // Example of how you can use socket.io for likes functionality
realtimechat(io); // Example of how you can handle real-time chat using socket.io

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
