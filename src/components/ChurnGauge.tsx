import { cn } from "@/lib/utils";

interface ChurnGaugeProps {
  value: number;
  className?: string;
}

const ChurnGauge = ({ value, className }: ChurnGaugeProps) => {
  const getRiskLevel = (val: number) => {
    if (val < 40) return { label: "LOW RISK", color: "text-icon-teal", bgColor: "bg-icon-teal" };
    if (val < 70) return { label: "MEDIUM RISK", color: "text-icon-orange", bgColor: "bg-icon-orange" };
    return { label: "HIGH RISK", color: "text-destructive", bgColor: "bg-destructive" };
  };

  const risk = getRiskLevel(value);
  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (value / 100) * circumference * 0.75;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-[135deg]" viewBox="0 0 200 200">
          {/* Background arc */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          />
          {/* Progress arc */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={value < 40 ? "hsl(var(--icon-teal))" : value < 70 ? "hsl(var(--icon-orange))" : "hsl(var(--destructive))"}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference * 0.75}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-foreground">{value}%</span>
          <span className="text-sm text-muted-foreground mt-1">Churn Risk</span>
          <span className={cn("text-xs font-semibold px-3 py-1 rounded-full mt-2 text-primary-foreground", risk.bgColor)}>
            {risk.label}
          </span>
        </div>
      </div>

      {/* Risk legend */}
      <div className="flex items-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-8 h-2 bg-icon-teal rounded-full" />
            <div className="w-4 h-2 bg-muted rounded-full" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Low Risk</p>
            <p className="text-xs text-muted-foreground">&lt; 40%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-8 h-2 bg-icon-orange rounded-full" />
            <div className="w-4 h-2 bg-muted rounded-full" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Medium Risk</p>
            <p className="text-xs text-muted-foreground">40% - 70%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-8 h-2 bg-destructive rounded-full" />
            <div className="w-4 h-2 bg-muted rounded-full" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">High Risk</p>
            <p className="text-xs text-muted-foreground">&gt; 70%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChurnGauge;
