"use client";

import type { Synthesis } from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.type";
import { Card, Chip } from "@repo/ui/heroui";

function getScoreColorClass(score: number): string {
  if (score >= 7) return "bg-success";
  if (score >= 4) return "bg-warning";
  return "bg-danger";
}

interface DimensionSummaryProps {
  resumenPorDimension: Synthesis["resumenPorDimension"];
}

export function DimensionSummary({
  resumenPorDimension,
}: DimensionSummaryProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">
        Resumen por Dimensión
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {resumenPorDimension.map((dim) => (
          <Card key={dim.dimension} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground truncate pr-2">
                {dim.dimension}
              </h4>
              <span className="text-sm font-bold text-foreground shrink-0">
                {dim.scorePromedio.toFixed(1)}
              </span>
            </div>
            <div className="w-full bg-default-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getScoreColorClass(dim.scorePromedio)}`}
                style={{ width: `${dim.scorePromedio * 10}%` }}
              />
            </div>
            <Chip variant="secondary" size="sm" className="text-xs">
              {dim.veredicto}
            </Chip>
            <p className="text-xs text-foreground/60 line-clamp-3">
              {dim.hallazgoPrincipal}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
