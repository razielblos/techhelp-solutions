import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SatisfactionChartProps {
  data: {
    Ruim: number;
    Regular: number;
    Médio: number;
    Bom: number;
    Excelente: number;
  };
}

const SatisfactionChart = ({ data }: SatisfactionChartProps) => {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  
  const categories = [
    { label: 'Ruim', value: data.Ruim, color: 'bg-red-500' },
    { label: 'Regular', value: data.Regular, color: 'bg-orange-500' },
    { label: 'Médio', value: data.Médio, color: 'bg-yellow-500' },
    { label: 'Bom', value: data.Bom, color: 'bg-green-500' },
    { label: 'Excelente', value: data.Excelente, color: 'bg-emerald-600' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Satisfação Média</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((cat) => {
          const percentage = total > 0 ? (cat.value / total) * 100 : 0;
          return (
            <div key={cat.label} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-16 text-right">{cat.label}</span>
              <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${cat.color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-foreground w-8">{cat.value}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SatisfactionChart;
