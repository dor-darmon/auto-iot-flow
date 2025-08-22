import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cpu, Thermometer, Wifi } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'warning';
  lastSeen: Date;
}

interface DeviceCardProps {
  device: Device;
}

export const DeviceCard = ({ device }: DeviceCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'offline': return 'bg-destructive';
      case 'warning': return 'bg-warning';
      default: return 'bg-muted';
    }
  };

  const getStatusVariant = (status: string): "default" | "destructive" | "secondary" => {
    switch (status) {
      case 'online': return 'default';
      case 'offline': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className="p-4 bg-gradient-card border-0 hover:shadow-glow-primary transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Cpu className="w-6 h-6 text-primary" />
            <div 
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(device.status)} ${
                device.status === 'online' ? 'animate-pulse' : ''
              }`} 
            />
          </div>
          <div>
            <h3 className="font-medium text-card-foreground">{device.name}</h3>
            <p className="text-sm text-muted-foreground">{device.id}</p>
          </div>
        </div>
        <Badge variant={getStatusVariant(device.status)}>
          {device.status}
        </Badge>
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
        <span>Last seen: {device.lastSeen.toLocaleTimeString()}</span>
        {device.status === 'online' && (
          <div className="flex items-center gap-1">
            <Wifi className="w-3 h-3" />
            <span className="text-success">Connected</span>
          </div>
        )}
      </div>

      {device.status === 'online' && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Thermometer className="w-3 h-3 mr-1" />
            Self Test
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Reset
          </Button>
        </div>
      )}
    </Card>
  );
};