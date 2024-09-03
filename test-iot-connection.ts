// Temp file to make sure connecting to AWS IOT is working
require('dotenv').config(); // To load environment variables
const { device } = require('aws-iot-device-sdk');

let iotDevice;

const connectToIoT = () => {
    if (!iotDevice) {
        iotDevice = device({
            keyPath: process.env.AWS_IOT_KEY_PATH,
            certPath: process.env.AWS_IOT_CERT_PATH,
            caPath: process.env.AWS_IOT_CA_PATH,
            clientId: 'fov-dashboard-server',
            host: process.env.AWS_IOT_ENDPOINT
        });
    }

    return new Promise((resolve, reject) => {
        iotDevice.on('connect', () => {
            console.log('Connected to AWS IoT');
            iotDevice.subscribe('fov/devices/+/status');
            resolve(iotDevice);
        });

        iotDevice.on('error', (error) => {
            console.error('Connection error:', error);
            reject(error);
        });

        iotDevice.on('message', (topic, payload) => {
            console.log('Received message:', topic, payload.toString());
        });
    });
};

async function testConnection() {
    try {
        await connectToIoT();
        console.log('Connection successful. Waiting for messages...');

        // Keep the script running to receive messages
        setTimeout(() => {
            console.log('Test completed. Exiting...');
            process.exit(0);
        }, 60000); // Run for 1 minute
    } catch (error) {
        console.error('Failed to connect:', error);
        process.exit(1);
    }
}

testConnection();