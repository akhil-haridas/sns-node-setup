require('dotenv').config();
const express = require("express");
const http = require("http");
const cors = require('cors');
const socketIo = require("socket.io");
const connectDB = require('./config/database');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { errorHandler } = require('./utils/errorHandler');
const subscriptionModel = require('./model/subscriptionModel');
const { sendPushNotification } = require('./service/pushNotificationService');

// Initialize the app
const app = express();
const server = http.createServer(app);

// MongoDB connection
connectDB();

// Setup Socket.io
const io = socketIo(server, {
    cors: {
        origin: ['https://supabase-chat-ivory.vercel.app', 'https://dev.app.rukkor.com', 'http://localhost:3000'],
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type']
    }
});

app.use(cors({
    origin: ['https://supabase-chat-ivory.vercel.app', 'https://dev.app.rukkor.com', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));



// Middleware
app.use(express.json());

// Routes
app.use('/subscribe', subscriptionRoutes);
app.use('/api', notificationRoutes);

// Error handling middleware
app.use(errorHandler);

// Socket.io logic for real-time messaging
io.on("connection", (socket) => {
    // console.log("A user connected");

    socket.on("chatMessage", async (data) => {
        console.log("message:",data)// Broadcast message to all clients
        const { message, userId, spaceId } = data;
        try {
            // Find subscriptions for the same groupId, but exclude the userId of the sender
            const subscriptions = await subscriptionModel.find({
                userId: { $ne: userId } // Exclude the current user's subscription
            });

            // Send push notifications to all relevant subscriptions
            subscriptions.forEach((sub) => {
                const messagePayload = JSON.stringify({
                    title: "New Chat Message",
                    body: message,
                    icon: "/path-to-icon.png", // Specify the notification icon path
                });
                sendPushNotification(sub, messagePayload);
            });

        } catch (err) {
            console.error("Error fetching subscriptions:", err);
        }

        // Here you can send push notifications to relevant users
        // using logic from the notification controller (or directly from socket event)
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
