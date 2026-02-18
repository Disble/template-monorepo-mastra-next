"use client";

import type { Synthesis } from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.type";
import { Card, Chip } from "@repo/ui/heroui";

function getScoreColor(score: number): "success" | "warning" | "danger" {
  if (score >= 7) return "success";
  if (score >= 4) return "warning";
  return "danger";
}

interface BiasCorrectionsProps {
  calibrationCorrections: Synthesis["correccionesDeSesgos"];
}

export function BiasCorrections({
  calibrationCorrections,
}: BiasCorrectionsProps) {
  if (calibrationCorrections.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">
        Correcciones de Calibración
      </h3>
      <p className="text-xs text-foreground/50">
        El agente de síntesis detectó y corrigió penalizaciones inadecuadas para
        el tipo de texto analizado.
      </p>
      <div className="space-y-2">
        {calibrationCorrections.map((correccion) => (
          <Card key={correccion.agente} className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-1 shrink-0 min-w-16">
                <span className="text-xs text-foreground/50 line-through tabular-nums">
                  {correccion.scoreOriginal.toFixed(1)}
                </span>
                <span className="text-xs text-foreground/30">→</span>
                <Chip
                  color={getScoreColor(correccion.scoreAjustado)}
                  variant="soft"
                  size="sm"
                  className="tabular-nums"
                >
                  {correccion.scoreAjustado.toFixed(1)}
                </Chip>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-foreground">
                    {correccion.agente}
                  </span>
                  <Chip variant="secondary" size="sm" className="text-xs">
                    {correccion.tipoSesgo}
                  </Chip>
                </div>
                <p className="text-xs text-foreground/60">
                  {correccion.explicacion}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
