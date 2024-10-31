const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({ region: 'us-east-1' }); // Update to your AWS region

const app = express();
app.use(bodyParser.json());

const sns = new AWS.SNS();
const topicArn = 'arn:aws:sns:us-east-1:637423239254:RukkorNotification';

// Subscribe endpoint (handles user endpoint registration)
app.post('/subscribe', async (req, res) => {
    const { endpoint } = req.body; // Pass the browser endpoint
    const params = {
        Protocol: 'http', // Use 'http' if HTTPS is not supported
        TopicArn: topicArn,
        Endpoint: endpoint,
    };

    try {
        const subscription = await sns.subscribe(params).promise();
        res.json({ message: 'Subscribed successfully', subscription });
    } catch (error) {
        console.error('Error subscribing:', error);
        res.status(500).json({ error: 'Failed to subscribe' });
    }
});

// Send notification to subscribers
app.post('/send-notification', async (req, res) => {
    const message = req.body.message || 'Hello from AWS SNS!';
    const params = {
        Message: message,
        TopicArn: topicArn,
    };

    try {
        await sns.publish(params).promise();
        res.json({ message: 'Notification sent!' });
    } catch (error) {
        console.error('Error publishing notification:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
});

app.listen(4000, () => {
    console.log('Server is running on port 3000');
});
