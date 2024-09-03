'use client';

import { useState, useEffect } from 'react';
import io from 'socket.io-client';

export interface DeviceStatus {
    id: number;
    name: string;
    wifiConnected: boolean;
    batteryCharge: number;
    temperature: number;
    firmwareVersion: string;
}

export const useIoTData = () => {
    const [devices, setDevices] = useState<DeviceStatus[]>([]);

    useEffect(() => {
        const socket = io();

        const connectToIoT = async () => {
            await fetch('/api/iot-connection');
        };
        connectToIoT();

        socket.on('iot-data', (data: DeviceStatus) => {
            setDevices(prevDevices => {
                const index = prevDevices.findIndex(d => d.id === data.id);
                if (index !== -1) {
                    const newDevices = [...prevDevices];
                    newDevices[index] = { ...newDevices[index], ...data };
                    return newDevices;
                } else {
                    return [...prevDevices, data];
                }
            });
        });

        return () => {
            socket.off('iot-data');
            socket.close();
        };
    }, []);

    return devices;
};