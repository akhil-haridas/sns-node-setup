const webPush = require('web-push');

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webPush.setVapidDetails(
    "mailto:your-email@example.com",
    publicVapidKey,
    privateVapidKey
);

module.exports = webPush;
