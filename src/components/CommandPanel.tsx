import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Terminal, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Device {
  id: string;
  name: string;
  status: string;
}

interface CommandPanelProps {
  devices: Device[];
}

export const CommandPanel = ({ devices }: CommandPanelProps) => {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [command, setCommand] = useState('selftest');
  const [customCommand, setCustomCommand] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const predefinedCommands = [
    { value: 'selftest', label: 'Self Test', description: 'Run device self-diagnostics' },
    { value: 'reset', label: 'Reset', description: 'Soft reset the device' },
    { value: 'status', label: 'Status', description: 'Get device status' },
    { value: 'calibrate', label: 'Calibrate', description: 'Calibrate sensors' },
    { value: 'custom', label: 'Custom', description: 'Send custom command' }
  ];

  const handleSendCommand = async () => {
    if (!selectedDevice || (!command && !customCommand)) {
      toast({
        title: "Invalid Command",
        description: "Please select a device and command",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate MQTT command sending
    setTimeout(() => {
      const commandToSend = command === 'custom' ? customCommand : command;
      toast({
        title: "Command Sent",
        description: `Sent "${commandToSend}" to ${selectedDevice}`,
        variant: "default"
      });
      setIsLoading(false);
    }, 1000);
  };

  const onlineDevices = devices.filter(d => d.status === 'online');

  return (
    <Card className="p-6 bg-gradient-card border-0">
      <div className="flex items-center gap-2 mb-6">
        <Terminal className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Command Panel</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="device-select">Target Device</Label>
          <Select value={selectedDevice} onValueChange={setSelectedDevice}>
            <SelectTrigger>
              <SelectValue placeholder="Select a device" />
            </SelectTrigger>
            <SelectContent>
              {onlineDevices.map((device) => (
                <SelectItem key={device.id} value={device.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    {device.name} ({device.id})
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {onlineDevices.length === 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              No online devices available
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="command-select">Command</Label>
          <Select value={command} onValueChange={setCommand}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {predefinedCommands.map((cmd) => (
                <SelectItem key={cmd.value} value={cmd.value}>
                  <div>
                    <div className="font-medium">{cmd.label}</div>
                    <div className="text-xs text-muted-foreground">{cmd.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {command === 'custom' && (
          <div>
            <Label htmlFor="custom-command">Custom Command</Label>
            <Textarea
              id="custom-command"
              placeholder="Enter custom JSON command..."
              value={customCommand}
              onChange={(e) => setCustomCommand(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
        )}

        <Button
          onClick={handleSendCommand}
          disabled={isLoading || onlineDevices.length === 0}
          className="w-full"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent" />
              Sending...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send Command
            </div>
          )}
        </Button>

        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-medium mb-2">Recent Commands</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">selftest → esp32-01</span>
              <Badge variant="default">Success</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">status → esp32-02</span>
              <Badge variant="default">Success</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">reset → pico-w-01</span>
              <Badge variant="destructive">Timeout</Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};