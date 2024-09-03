import { WifiIcon, BatteryIcon, ThermometerIcon, CpuIcon } from "lucide-react"

// Mock data for IoT devices
const devices = [
    { id: 1, name: "fov-marvel-tablet-1", wifiConnected: true, batteryCharge: 80, temperature: 22.5, firmwareVersion: "1.2.3" },
    { id: 2, name: "fov-marvel-tablet-2", wifiConnected: false, batteryCharge: 20, temperature: 25.0, firmwareVersion: "1.1.9" },
    { id: 3, name: "fov-marvel-tablet-3", wifiConnected: true, batteryCharge: 60, temperature: 21.0, firmwareVersion: "1.2.2" },
    { id: 4, name: "fov-marvel-tablet-4", wifiConnected: true, batteryCharge: 90, temperature: 18.5, firmwareVersion: "1.2.3" },
    { id: 5, name: "fov-marvel-tablet-5", wifiConnected: true, batteryCharge: 90, temperature: 18.5, firmwareVersion: "1.2.3" },
]

interface DeviceProps {
  name: string
  wifiConnected: boolean
  batteryCharge: number
  temperature: number
  firmwareVersion: string
}

function DeviceComponent({ name, wifiConnected, batteryCharge, temperature, firmwareVersion }: DeviceProps) {
  return (
      <div className="bg-card text-card-foreground rounded-lg shadow-md p-4 flex flex-col space-y-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <div className="flex items-center space-x-2">
          <WifiIcon className={`h-5 w-5 ${wifiConnected ? 'text-green-500' : 'text-red-500'}`} />
          <span>{wifiConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BatteryIcon className="h-5 w-5" />
              <span>Battery</span>
            </div>
            <span className="font-medium">{batteryCharge}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${batteryCharge}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ThermometerIcon className="h-5 w-5" />
          <span>Temperature: {temperature}°C</span>
        </div>
        <div className="flex items-center space-x-2">
          <CpuIcon className="h-5 w-5" />
          <span>Firmware: {firmwareVersion}</span>
        </div>
      </div>
  )
}

export default function Component() {
  return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">IoT Device Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {devices.map((device) => (
              <DeviceComponent key={device.id} {...device} />
          ))}
        </div>
      </div>
  )
}