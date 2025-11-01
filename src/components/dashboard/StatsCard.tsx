import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'primary' | 'success' | 'warning' | 'default';
  subtitle?: string;
}

const StatsCard = ({ title, value, icon: Icon, variant = 'default', subtitle }: StatsCardProps) => {
  const variantClasses = {
    primary: 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20',
    success: 'bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20',
    warning: 'bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20',
    default: 'bg-card border-border',
  };

  const iconClasses = {
    primary: 'text-primary bg-primary/10',
    success: 'text-green-600 bg-green-500/10',
    warning: 'text-amber-600 bg-amber-500/10',
    default: 'text-foreground bg-muted',
  };

  return (
    <Card className={`${variantClasses[variant]} transition-all duration-300 hover:shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${iconClasses[variant]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
