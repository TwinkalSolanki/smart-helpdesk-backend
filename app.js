require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const initCRON = require('./crons');
const cors = require('cors');
const socketIo = require('socket.io');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: true}));

// Mongo DB connect
mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch((error) => console.log(error.message, 'Mongo connection failed', error));

// Define Routes
require('./routes')(app);

//create server
const server = http.createServer(app);

// initialize socket.io
const io = socketIo(server, {
  cors: {
    origin: "*",   // or put your frontend URL
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

app.set('io', io); // store io instance in app

initCRON();                    // start cron jobs (SMS/Email worker)

server.listen(process.env.PORT, () => { 
    console.log(`Server started on port ${process.env.PORT}`);
});



