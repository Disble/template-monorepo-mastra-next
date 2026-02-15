"use client";

import type { Synthesis } from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.type";
import { Card, Chip } from "@repo/ui/heroui";
import { useState } from "react";

function getScoreColorClass(score: number): string {
  if (score >= 7) return "bg-success";
  if (score >= 4) return "bg-warning";
  return "bg-danger";
}

interface DimensionCardProps {
  dim: Synthesis["resumenPorDimension"][number];
}

function DimensionCard({ dim }: DimensionCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-foreground leading-tight">
          {dim.dimension}
        </h4>
        <span className="text-sm font-bold text-foreground shrink-0 tabular-nums">
          {dim.scorePromedio.toFixed(1)}
        </span>
      </div>
      <div className="w-full bg-default-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getScoreColorClass(dim.scorePromedio)}`}
          style={{ width: `${dim.scorePromedio * 10}%` }}
        />
      </div>
      <Chip variant="secondary" size="sm" className="text-xs max-w-full">
        <span className="truncate">{dim.veredicto}</span>
      </Chip>
      <div>
        <p
          className={`text-xs text-foreground/60 ${expanded ? "" : "line-clamp-3"}`}
        >
          {dim.hallazgoPrincipal}
        </p>
        {dim.hallazgoPrincipal.length > 120 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-accent font-medium mt-1 hover:underline cursor-pointer"
          >
            {expanded ? "Ver menos" : "Ver más"}
          </button>
        )}
      </div>
    </Card>
  );
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
        {resumenPorDimension.map((dim) => (
          <DimensionCard key={dim.dimension} dim={dim} />
        ))}
      </div>
    </div>
  );
}
