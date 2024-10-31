const express = require("express");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
const webPush = require("web-push");

const app = express();
app.use(bodyParser.json());

AWS.config.update({ region: "us-east-1" }); // Set your AWS region
const sns = new AWS.SNS();

const topicArn = "arn:aws:sns:us-east-1:637423239254:RukkorNotification";
const vapidPublicKey = "BE2horS7WnET4R7_vN5X0GxQBXTpps3_023v2z_N4E9Q5VF-yvrpF5uOZ4f7CIjKhSDnTme_UtDAZZXBKAdlCwI";
const vapidPrivateKey = "UOV9-3R9sHYcypJapB5xV9zt-AjsTHf0F5iHoRFnnHc";

// Configure VAPID keys
webPush.setVapidDetails(
    "mailto:akhil.k@dignizant.com",
    vapidPublicKey,
    vapidPrivateKey
);

// Endpoint to subscribe user
app.post("/subscribe", async (req, res) => {
    const { endpoint } = req.body;
    const params = {
        Protocol: "https",
        TopicArn: topicArn,
        Endpoint: endpoint,
    };
    try {
        const subscription = await sns.subscribe(params).promise();
        res.json({ message: "Subscribed successfully", subscription });
    } catch (error) {
        res.status(500).json({ error: "Subscription failed" });
    }
});

// Endpoint to send notifications
app.post("/send-notification", async (req, res) => {
    const message = req.body.message || "Hello from AWS SNS!";
    const params = {
        Message: message,
        TopicArn: topicArn,
    };
    try {
        await sns.publish(params).promise();
        res.json({ message: "Notification sent!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send notification" });
    }
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
