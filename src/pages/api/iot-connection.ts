import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketServer } from 'socket.io';
import { device } from 'aws-iot-device-sdk';

let iotDevice: any;

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

        iotDevice.on('error', (error: Error) => {
            console.error('Connection error:', error);
            reject(error);
        });
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        if (!res.socket.server.io) {
            console.log('Setting up socket.io');
            const io = new SocketServer(res.socket.server);
            res.socket.server.io = io;

            try {
                await connectToIoT();
                iotDevice.on('message', (topic: string, payload: Buffer) => {
                    const data = JSON.parse(payload.toString());
                    io.emit('iot-data', data);
                });
            } catch (error) {
                console.error('Failed to connect to AWS IoT:', error);
            }
        }
        res.end();
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}