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
  const { identificacionDelTexto, evaluacionGlobal, veredictoEditorial } =
    synthesis;

  return (
    <div className="space-y-4">
      {/* Text Identification */}
      <Card className="p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Clasificación del Texto
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
          <div>
            <span className="text-xs text-foreground/50 uppercase tracking-wide">
              Género / Tono
            </span>
            <p className="text-sm text-foreground/80">
              {identificacionDelTexto.generoYTono}
            </p>
          </div>
          <div>
            <span className="text-xs text-foreground/50 uppercase tracking-wide">
              Propósito Narrativo
            </span>
            <p className="text-sm text-foreground/80">
              {identificacionDelTexto.propositoNarrativo}
            </p>
          </div>
          <div>
            <span className="text-xs text-foreground/50 uppercase tracking-wide">
              Público Objetivo
            </span>
            <p className="text-sm text-foreground/80">
              {identificacionDelTexto.publicoObjetivo}
            </p>
          </div>
          <div>
            <span className="text-xs text-foreground/50 uppercase tracking-wide">
              Modelo de Personaje
            </span>
            <p className="text-sm text-foreground/80">
              {identificacionDelTexto.modeloDePersonaje}
            </p>
          </div>
          <div>
            <span className="text-xs text-foreground/50 uppercase tracking-wide">
              Fuente de Enganche
            </span>
            <p className="text-sm text-foreground/80">
              {identificacionDelTexto.fuenteDeEnganche}
            </p>
          </div>
        </div>
      </Card>

      {/* Score + Summary */}
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
          </div>
        </div>
      </Card>

      {/* Editorial Verdict - rendered with preserved whitespace for structured content */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Veredicto Editorial
        </h3>
        <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
          {veredictoEditorial}
        </div>
      </Card>
    </div>
  );
}
