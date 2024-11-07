const webPush = require('web-push');

const publicVapidKey = process.env.PUBLIC_VAPID_KEY || "BJ4EwHWUsuUNRgHRn_bgNtjXAhIlGZeXtmQB9JdjTHinygmzIGBl9GYIih09IotP3v7k3qESo9RVh825jXUHSZg";
const privateVapidKey = process.env.PRIVATE_VAPID_KEY || "E7602w8Nll6W3BHVIrnDJKYwC4jiLOh2A44_b8maScE";

webPush.setVapidDetails(
    "mailto:your-email@example.com",
    publicVapidKey,
    privateVapidKey
);

module.exports = webPush;
