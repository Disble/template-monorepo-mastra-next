"use client";

import { Accordion, Chip } from "@repo/ui/heroui";
import { CriteriaScoreBar } from "./criteria-score-bar";

interface Criterio {
  nombre: string;
  score: number;
  explicacion: string;
}

interface AnalysisDetailCardProps {
  title: string;
  veredicto: string;
  criterios?: Criterio[];
  diagnostico?: string;
  recomendaciones?: string[];
  children?: React.ReactNode;
}

export function AnalysisDetailCard({
  title,
  veredicto,
  criterios,
  diagnostico,
  recomendaciones,
  children,
}: AnalysisDetailCardProps) {
  return (
    <Accordion.Item>
      <Accordion.Heading>
        <Accordion.Trigger>
          <div className="flex items-center gap-2">
            <span>{title}</span>
            <Chip variant="secondary" size="sm" className="text-xs">
              {veredicto}
            </Chip>
          </div>
          <Accordion.Indicator />
        </Accordion.Trigger>
      </Accordion.Heading>
      <Accordion.Panel>
        <Accordion.Body>
          <div className="space-y-4 pb-2">
            {diagnostico && (
              <p className="text-sm text-foreground/80">{diagnostico}</p>
            )}

            {criterios && criterios.length > 0 && (
              <div className="space-y-3">
                <h5 className="text-sm font-semibold text-foreground">
                  Criterios
                </h5>
                {criterios.map((c) => (
                  <CriteriaScoreBar
                    key={c.nombre}
                    nombre={c.nombre}
                    score={c.score}
                    explicacion={c.explicacion}
                  />
                ))}
              </div>
            )}

            {children}

            {recomendaciones && recomendaciones.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-semibold text-foreground">
                  Recomendaciones
                </h5>
                <ul className="space-y-1">
                  {recomendaciones.map((r, i) => (
                    <li
                      key={i}
                      className="text-sm text-foreground/70 flex items-start gap-2"
                    >
                      <span className="text-accent shrink-0 mt-0.5">-</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Accordion.Body>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
