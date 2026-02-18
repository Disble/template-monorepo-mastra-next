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
  const {
    identificacionDelTexto: textIdentification,
    evaluacionGlobal: globalEvaluation,
    patronNarrativo: narrativePattern,
    veredictoEditorial: editorialVerdict,
  } = synthesis;

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
              {textIdentification.generoYTono}
            </p>
          </div>
          <div>
            <span className="text-xs text-foreground/50 uppercase tracking-wide">
              Propósito Narrativo
            </span>
            <p className="text-sm text-foreground/80">
              {textIdentification.propositoNarrativo}
            </p>
          </div>
          <div>
            <span className="text-xs text-foreground/50 uppercase tracking-wide">
              Público Objetivo
            </span>
            <p className="text-sm text-foreground/80">
              {textIdentification.publicoObjetivo}
            </p>
          </div>
          <div>
            <span className="text-xs text-foreground/50 uppercase tracking-wide">
              Modelo de Personaje
            </span>
            <p className="text-sm text-foreground/80">
              {textIdentification.modeloDePersonaje}
            </p>
          </div>
          <div>
            <span className="text-xs text-foreground/50 uppercase tracking-wide">
              Fuente de Enganche
            </span>
            <p className="text-sm text-foreground/80">
              {textIdentification.fuenteDeEnganche}
            </p>
          </div>
          <div>
            <span className="text-xs text-foreground/50 uppercase tracking-wide">
              Patrón Narrativo
            </span>
            <div className="mt-1 flex items-center gap-2">
              <Chip variant="soft" size="sm" color="default">
                {narrativePattern.patron}
              </Chip>
              <p className="text-sm text-foreground/80">
                {narrativePattern.justificacion}
              </p>
            </div>
            {narrativePattern.notaFriccionAudiencia && (
              <p className="text-xs text-foreground/60 mt-1">
                {narrativePattern.notaFriccionAudiencia}
              </p>
            )}
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
                globalEvaluation.scoreGlobal >= 7
                  ? "border-success text-success"
                  : globalEvaluation.scoreGlobal >= 4
                    ? "border-warning text-warning"
                    : "border-danger text-danger"
              }`}
            >
              <span className="text-3xl font-bold">
                {globalEvaluation.scoreGlobal.toFixed(1)}
              </span>
            </div>
            <Chip
              color={getScoreColor(globalEvaluation.scoreGlobal)}
              variant="soft"
              size="sm"
            >
              {globalEvaluation.categoria}
            </Chip>
          </div>

          {/* Summary text */}
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Resumen Ejecutivo
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {globalEvaluation.resumenEjecutivo}
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
          {editorialVerdict}
        </div>
      </Card>
    </div>
  );
}
