const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/recipes', require('./routes/recipe'));
app.use('/api/auth', require('./routes/auth'));
app.use('/uploads', express.static('uploads'));


// Create HTTP Server and Enable WebSockets
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

// Real-Time Recipe Sharing
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('newRecipe', (recipe) => {
        io.emit('updateRecipes', recipe); // Broadcast new recipe to all clients
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
