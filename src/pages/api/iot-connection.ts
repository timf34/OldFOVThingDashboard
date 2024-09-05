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
            iotDevice.subscribe('ap-southeast-2/marvel/fov-marvel-tablet-1/+');
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
                    console.log('Received message:', topic, data);
                    const topicParts = topic.split('/');
                    const dataType = topicParts[topicParts.length - 1];
                    io.emit('iot-data', { type: dataType, value: data });
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

const SocketHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (res.socket.server.io) {
        console.log('Socket is already running');
        res.end();
        return;
    }

    console.log('Setting up socket');
    const io = new SocketServer(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    try {
        await connectToIoT();
        iotDevice.on('message', (topic: string, payload: Buffer) => {
            const data = JSON.parse(payload.toString());
            console.log('Received message:', topic, data);
            const topicParts = topic.split('/');
            const dataType = topicParts[topicParts.length - 1];
            io.emit('iot-data', { type: dataType, value: data });
        });
    } catch (error) {
        console.error('Failed to connect to AWS IoT:', error);
    }

    res.end();
};