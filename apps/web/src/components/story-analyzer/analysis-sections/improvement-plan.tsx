"use client";

import type { Synthesis } from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.type";
import { Card, Chip } from "@repo/ui/heroui";

interface ImprovementPlanProps {
  planDeMejora: Synthesis["planDeMejora"];
  fortalezasPrincipales: Synthesis["fortalezasPrincipales"];
  debilidadesPrincipales: Synthesis["debilidadesPrincipales"];
}

export function ImprovementPlan({
  planDeMejora,
  fortalezasPrincipales,
  debilidadesPrincipales,
}: ImprovementPlanProps) {
  return (
    <div className="space-y-6">
      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 space-y-3">
          <h4 className="text-sm font-semibold text-success">Fortalezas</h4>
          <ul className="space-y-2">
            {fortalezasPrincipales.map((f, i) => (
              <li
                key={i}
                className="text-sm text-foreground/80 flex items-start gap-2"
              >
                <span className="text-success shrink-0 mt-0.5">+</span>
                {f}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-4 space-y-3">
          <h4 className="text-sm font-semibold text-danger">Debilidades</h4>
          <ul className="space-y-2">
            {debilidadesPrincipales.map((d, i) => (
              <li
                key={i}
                className="text-sm text-foreground/80 flex items-start gap-2"
              >
                <span className="text-danger shrink-0 mt-0.5">-</span>
                {d}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Improvement Plan */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          Plan de Mejora
        </h3>
        <div className="space-y-2">
          {planDeMejora
            .sort((a, b) => a.prioridad - b.prioridad)
            .map((item, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <Chip
                    color="accent"
                    variant="soft"
                    size="sm"
                    className="shrink-0 mt-0.5"
                  >
                    #{item.prioridad}
                  </Chip>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {item.area}
                    </p>
                    <p className="text-sm text-foreground/70">
                      {item.recomendacion}
                    </p>
                    <p className="text-xs text-foreground/50 italic">
                      Impacto: {item.impactoEsperado}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
