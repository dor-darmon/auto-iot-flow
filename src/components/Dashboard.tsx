import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DeviceCard } from '@/components/DeviceCard';
import { TelemetryChart } from '@/components/TelemetryChart';
import { TestResults } from '@/components/TestResults';
import { CommandPanel } from '@/components/CommandPanel';
import { Activity, Wifi, Server } from 'lucide-react';

interface TelemetryData {
  deviceId: string;
  ts: string;
  temperature: number;
  status: string;
}

interface TestResult {
  deviceId: string;
  ts: string;
  selfTest: string;
}

export const Dashboard = () => {
  const [devices] = useState([
    { id: 'esp32-01', name: 'ESP32 Dev Board', status: 'online' as const, lastSeen: new Date() },
    { id: 'esp32-02', name: 'Temperature Sensor', status: 'online' as const, lastSeen: new Date() },
    { id: 'pico-w-01', name: 'Pico W Controller', status: 'offline' as const, lastSeen: new Date(Date.now() - 300000) }
  ]);

  const [telemetryData, setTelemetryData] = useState<TelemetryData[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [mqttConnected, setMqttConnected] = useState(true);

  // Simulate real-time telemetry data
  useEffect(() => {
    const interval = setInterval(() => {
      const newData: TelemetryData = {
        deviceId: 'esp32-01',
        ts: new Date().toISOString(),
        temperature: 20 + Math.random() * 10,
        status: Math.random() > 0.1 ? 'OK' : 'WARNING'
      };
      
      setTelemetryData(prev => [...prev.slice(-49), newData]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulate test results
  useEffect(() => {
    const interval = setInterval(() => {
      const newTest: TestResult = {
        deviceId: devices[Math.floor(Math.random() * devices.length)].id,
        ts: new Date().toISOString(),
        selfTest: Math.random() > 0.15 ? 'PASS' : 'FAIL'
      };
      
      setTestResults(prev => [...prev.slice(-9), newTest]);
    }, 15000);

    return () => clearInterval(interval);
  }, [devices]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              IoT Automation Framework
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time device monitoring and automation control
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant={mqttConnected ? "default" : "destructive"} className="gap-2">
              <Wifi className="w-3 h-3" />
              MQTT {mqttConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            <Badge variant="secondary" className="gap-2">
              <Server className="w-3 h-3" />
              {devices.filter(d => d.status === 'online').length} Online
            </Badge>
          </div>
        </div>

        {/* System Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-card border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Devices</p>
                <p className="text-2xl font-bold">{devices.filter(d => d.status === 'online').length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-card border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-success/10">
                <div className="w-6 h-6 rounded-full bg-success animate-pulse" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Messages/Min</p>
                <p className="text-2xl font-bold">{Math.floor(Math.random() * 50 + 20)}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-card border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-accent/10">
                <div className="w-6 h-6 text-accent">
                  {testResults.filter(t => t.selfTest === 'PASS').length > testResults.filter(t => t.selfTest === 'FAIL').length ? '✓' : '!'}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">System Health</p>
                <p className="text-2xl font-bold">
                  {testResults.length > 0 && testResults.filter(t => t.selfTest === 'PASS').length / testResults.length > 0.8 ? 'Good' : 'Warning'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Devices & Commands */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Connected Devices</h2>
              <div className="space-y-3">
                {devices.map(device => (
                  <DeviceCard key={device.id} device={device} />
                ))}
              </div>
            </div>
            
            <CommandPanel devices={devices} />
          </div>

          {/* Middle Column - Telemetry */}
          <div className="lg:col-span-2 space-y-6">
            <TelemetryChart data={telemetryData} />
            <TestResults results={testResults} />
          </div>
        </div>
      </div>
    </div>
  );
};