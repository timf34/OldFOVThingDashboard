import { device } from 'aws-iot-device-sdk';

let iotDevice: any;

export const connectToIoT = () => {
    if (!iotDevice) {
        iotDevice = device({
            keyPath: process.env.AWS_IOT_KEY_PATH,
            certPath: process.env.AWS_IOT_CERT_PATH,
            caPath: process.env.AWS_IOT_CA_PATH,
            clientId: 'fov-dashboard-client',
            host: process.env.AWS_IOT_ENDPOINT
        });
    }

    return new Promise((resolve, reject) => {
        iotDevice.on('connect', () => {
            console.log('Connected to AWS IoT');
            iotDevice.subscribe('fov/devices/+/status');
            resolve(iotDevice);
        });

        iotDevice.on('error', (error: Error) => {
            console.error('Connection error:', error);
            reject(error);
        });
    });
};

export const getIoTDevice = () => iotDevice;