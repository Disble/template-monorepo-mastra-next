"use client";

import type { Synthesis } from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.type";
import { Card, Chip } from "@repo/ui/heroui";

function getScoreColor(score: number): "success" | "warning" | "danger" {
  if (score >= 7) return "success";
  if (score >= 4) return "warning";
  return "danger";
}

interface SynthesisOverviewProps {
  synthesis: Synthesis;
}

export function SynthesisOverview({ synthesis }: SynthesisOverviewProps) {
  const { evaluacionGlobal, veredictoEditorial } = synthesis;

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Score circle */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div
            className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${
              evaluacionGlobal.scoreGlobal >= 7
                ? "border-success text-success"
                : evaluacionGlobal.scoreGlobal >= 4
                  ? "border-warning text-warning"
                  : "border-danger text-danger"
            }`}
          >
            <span className="text-3xl font-bold">
              {evaluacionGlobal.scoreGlobal.toFixed(1)}
            </span>
          </div>
          <Chip
            color={getScoreColor(evaluacionGlobal.scoreGlobal)}
            variant="soft"
            size="sm"
          >
            {evaluacionGlobal.categoria}
          </Chip>
        </div>

        {/* Summary text */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Resumen Ejecutivo
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {evaluacionGlobal.resumenEjecutivo}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">
              Veredicto Editorial
            </h4>
            <p className="text-sm text-foreground/70 leading-relaxed italic">
              {veredictoEditorial}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
