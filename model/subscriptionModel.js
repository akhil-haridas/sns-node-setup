const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    groupId: { type: String, required: false },
    endpoint: { type: String, required: true, unique: true },
    keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true },
    },
    createdAt: { type: Date, default: Date.now, expires: "30d" },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
