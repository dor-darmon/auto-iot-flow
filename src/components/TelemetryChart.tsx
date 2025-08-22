import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface TelemetryData {
  deviceId: string;
  ts: string;
  temperature: number;
  status: string;
}

interface TelemetryChartProps {
  data: TelemetryData[];
}

export const TelemetryChart = ({ data }: TelemetryChartProps) => {
  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const chartData = data.map(item => ({
    ...item,
    time: formatTime(item.ts),
    temp: Math.round(item.temperature * 10) / 10
  }));

  return (
    <Card className="p-6 bg-gradient-card border-0">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Real-time Telemetry</h2>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">Live Data</span>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--card-foreground))'
                }}
                labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
              />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                name="Temperature (°C)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="animate-pulse mb-2">📊</div>
            <p>Waiting for telemetry data...</p>
            <p className="text-sm">Data will appear every 5 seconds</p>
          </div>
        </div>
      )}

      {data.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Current</p>
            <p className="text-lg font-semibold text-primary">
              {data[data.length - 1]?.temperature.toFixed(1)}°C
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Average</p>
            <p className="text-lg font-semibold">
              {(data.reduce((sum, item) => sum + item.temperature, 0) / data.length).toFixed(1)}°C
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Min</p>
            <p className="text-lg font-semibold text-accent">
              {Math.min(...data.map(item => item.temperature)).toFixed(1)}°C
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Max</p>
            <p className="text-lg font-semibold text-warning">
              {Math.max(...data.map(item => item.temperature)).toFixed(1)}°C
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};