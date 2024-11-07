const subscriptionModel = require("../model/subscriptionModel");

const subscribe = async (req, res) => {
    console.log("Subscribe",req.body)
    const { subscription, userId } = req.body;

    try {
        await subscriptionModel.findOneAndUpdate(
            { endpoint: subscription.endpoint },
            { ...subscription, userId },
            { upsert: true, new: true }
        );
        res.status(201).json({ message: "Subscription stored successfully." });
    } catch (error) {
        console.error("Error storing subscription:", error);
        res.status(500).json({ error: "Failed to store subscription." });
    }
};

module.exports = { subscribe };
