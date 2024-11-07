const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://Akhill:f5NSujSjRVRu6txr@rukkornotification.snaow.mongodb.net/?retryWrites=true&w=majority&appName=RukkorNotification", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
