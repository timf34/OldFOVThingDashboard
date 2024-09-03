'use client';

import { useIoTData } from './hooks/useIoTData';
import DeviceComponent from './components/DeviceComponent';

// const devices = [
//     { id: 1, name: "fov-marvel-tablet-1", wifiConnected: true, batteryCharge: 80, temperature: 22.5, firmwareVersion: "1.2.3" },
//     { id: 2, name: "fov-marvel-tablet-2", wifiConnected: false, batteryCharge: 20, temperature: 25.0, firmwareVersion: "1.1.9" },
//     { id: 3, name: "fov-marvel-tablet-3", wifiConnected: true, batteryCharge: 60, temperature: 21.0, firmwareVersion: "1.2.2" },
//     { id: 4, name: "fov-marvel-tablet-4", wifiConnected: true, batteryCharge: 90, temperature: 18.5, firmwareVersion: "1.2.3" },
//     { id: 5, name: "fov-marvel-tablet-5", wifiConnected: true, batteryCharge: 90, temperature: 18.5, firmwareVersion: "1.2.3" },
// ]



export default function Component() {
    const devices = useIoTData();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">IoT Device Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {devices.map((device) => (
                    <DeviceComponent key={device.id} {...device} />
                ))}
            </div>
        </div>
    );
}