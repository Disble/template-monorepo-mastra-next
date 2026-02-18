"use client";

import type { Synthesis } from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.type";
import { Card, Chip } from "@repo/ui/heroui";

function getImpactColor(impacto: string): "danger" | "warning" | "default" {
  if (impacto === "ALTO") return "danger";
  if (impacto === "MEDIO") return "warning";
  return "default";
}

interface CrossPatternsProps {
  crossPatterns: Synthesis["patronesTransversales"];
}

export function CrossPatterns({ crossPatterns }: CrossPatternsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">
        Patrones Transversales
      </h3>
      <div className="space-y-3">
        {crossPatterns.map((patron) => (
          <Card key={patron.patron} className="p-4">
            <div className="flex items-start gap-3">
              <Chip
                color={getImpactColor(patron.impacto)}
                variant="soft"
                size="sm"
                className="shrink-0 mt-0.5"
              >
                {patron.impacto}
              </Chip>
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-foreground">
                  {patron.patron}
                </p>
                <p className="text-xs text-foreground/60">
                  {patron.explicacion}
                </p>
                <div className="flex flex-wrap gap-1">
                  {patron.dimensionesAfectadas.map((dim) => (
                    <Chip
                      key={dim}
                      variant="secondary"
                      size="sm"
                      className="text-xs"
                    >
                      {dim}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
