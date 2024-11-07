const webPush = require('../config/webpush');
const subscriptionModel = require('../model/subscriptionModel');

const sendPushNotification = (subscription, message) => {
    console.log("subscription ::",subscription)
    webPush.sendNotification({
        endpoint: subscription.endpoint,
        keys: {
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
        },
    }, message)
        .then(response => {
            console.log("Notification sent:", response);
        })
        .catch(err => {
            if (err.statusCode === 410) {
                console.log("Subscription expired or is no longer valid");
                // Here, remove the expired subscription from your database
                subscriptionModel.deleteOne({ 'subscriptionDetails.endpoint': subscription.endpoint })
                    .then(() => console.log('Expired subscription removed'))
                    .catch(err => console.error('Error removing expired subscription:', err));
            } else {
                console.error("Error sending notification:", err);
            }
        });
};

module.exports = { sendPushNotification };
