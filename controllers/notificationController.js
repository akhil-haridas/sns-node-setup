const subscriptionModel = require("../model/subscriptionModel");
const { sendPushNotification } = require("../service/pushNotificationService");

const sendNotification = async (req, res) => {
    try {
        const { message, groupId, senderId } = req.body;

        const subscriptions = groupId
            ? await subscriptionModel.find({ groupId })
            : await subscriptionModel.find({ userId: { $ne: senderId } });

        const notificationPayload = JSON.stringify({
            title: "New Message",
            body: message,
            icon: "/path-to-icon.png", // Replace with your icon URL
        });

        subscriptions.forEach(sub => {
            sendPushNotification(sub, notificationPayload);
        });

        res.status(200).json({ message: "Notifications sent successfully." });
    } catch (err) {
        console.error("Error sending notifications:", err);
        res.status(500).json({ error: "Failed to send notifications" });
    }
};

module.exports = { sendNotification };
