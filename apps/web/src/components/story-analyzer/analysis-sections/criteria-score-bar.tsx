"use client";

function getScoreColorClass(score: number): string {
  if (score >= 7) return "bg-success";
  if (score >= 4) return "bg-warning";
  return "bg-danger";
}

interface CriteriaScoreBarProps {
  nombre: string;
  score: number;
  explicacion?: string;
}

export function CriteriaScoreBar({
  nombre,
  score,
  explicacion,
}: CriteriaScoreBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{nombre}</span>
        <span className="text-sm font-semibold text-foreground">
          {score}/10
        </span>
      </div>
      <div className="w-full bg-default-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getScoreColorClass(score)}`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
      {explicacion && (
        <p className="text-xs text-foreground/60 mt-1">{explicacion}</p>
      )}
    </div>
  );
}
