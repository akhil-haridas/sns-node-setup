require('dotenv').config();

const express = require("express");
const cors = require('cors');
const webPush = require("web-push");
const http = require("http");
const socketIo = require("socket.io");

// Setup Express server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type']
    }
});

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Body parser for JSON requests
app.use(express.json());

// VAPID keys for Web Push API (you can generate your own keys)
const publicVapidKey = process.env.PUBLIC_VAPID_KEY || "BJ4EwHWUsuUNRgHRn_bgNtjXAhIlGZeXtmQB9JdjTHinygmzIGBl9GYIih09IotP3v7k3qESo9RVh825jXUHSZg";
const privateVapidKey = process.env.PRIVATE_VAPID_KEY || "E7602w8Nll6W3BHVIrnDJKYwC4jiLOh2A44_b8maScE";

webPush.setVapidDetails(
    "mailto:akhil.k@dignizant.com",
    publicVapidKey,
    privateVapidKey
);

let subscriptions = []; // Store user subscriptions (in-memory for simplicity)

// Route to handle subscription
app.post("/subscribe", (req, res) => {
    console.log("api called subscription")
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
});

// Function to send push notifications
const sendPushNotification = (subscription, message) => {
    webPush
        .sendNotification(subscription, message)
        .catch((err) => console.error(err));
};

// WebSocket for real-time chat messages
io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("chatMessage", (msg) => {
        console.log("new message",subscriptions)
        io.emit("chatMessage", msg); // Emit the message to all clients

        // Send a push notification if there are active subscriptions
        subscriptions.forEach((sub) => {
            const message = JSON.stringify({
                title: "New Chat Message",
                body: msg,
                icon: "/path-to-icon.png", // Replace with an actual icon URL
            });
            sendPushNotification(sub, message);
        });
    });

    socket.on("disconnect", () => {
        console.log("a user disconnected");
    });
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
