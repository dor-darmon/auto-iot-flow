import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface TestResult {
  deviceId: string;
  ts: string;
  selfTest: string;
}

interface TestResultsProps {
  results: TestResult[];
}

export const TestResults = ({ results }: TestResultsProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'FAIL':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-warning" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "destructive" | "secondary" => {
    switch (status) {
      case 'PASS': return 'default';
      case 'FAIL': return 'destructive';
      default: return 'secondary';
    }
  };

  const passRate = results.length > 0 
    ? ((results.filter(r => r.selfTest === 'PASS').length / results.length) * 100).toFixed(1)
    : '0';

  return (
    <Card className="p-6 bg-gradient-card border-0">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Self-Test Results</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Pass Rate: </span>
            <span className="font-semibold text-success">{passRate}%</span>
          </div>
          <Badge variant="secondary">{results.length} Tests</Badge>
        </div>
      </div>

      {results.length > 0 ? (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {results.slice().reverse().map((result, index) => (
            <div 
              key={`${result.deviceId}-${result.ts}-${index}`}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(result.selfTest)}
                <div>
                  <p className="font-medium">{result.deviceId}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(result.ts).toLocaleString()}
                  </p>
                </div>
              </div>
              <Badge variant={getStatusVariant(result.selfTest)}>
                {result.selfTest}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <div className="mb-2">🔧</div>
          <p>No test results yet</p>
          <p className="text-sm">Self-tests run automatically every 15 seconds</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-muted-foreground">Passed</p>
              <p className="text-lg font-semibold text-success">
                {results.filter(r => r.selfTest === 'PASS').length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Failed</p>
              <p className="text-lg font-semibold text-destructive">
                {results.filter(r => r.selfTest === 'FAIL').length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Success Rate</p>
              <p className={`text-lg font-semibold ${parseFloat(passRate) > 80 ? 'text-success' : 'text-warning'}`}>
                {passRate}%
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};