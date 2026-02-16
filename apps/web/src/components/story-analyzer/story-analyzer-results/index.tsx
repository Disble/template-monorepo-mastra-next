"use client";

import { Accordion, Chip, Spinner } from "@repo/ui/heroui";
import { ValidationErrorAlert } from "#components/commons/validation-error-alert";
import { AnalysisDetailCard } from "../analysis-sections/analysis-detail-card";
import { BiasCorrections } from "../analysis-sections/bias-corrections";
import { CrossPatterns } from "../analysis-sections/cross-patterns";
import { DimensionSummary } from "../analysis-sections/dimension-summary";
import { ImprovementPlan } from "../analysis-sections/improvement-plan";
import { StoryTextViewer } from "../analysis-sections/story-text-viewer";
import { SynthesisOverview } from "../analysis-sections/synthesis-overview";
import { useStoryAnalyzerResults } from "./story-analyzer-results.hook";

function CalibrationChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-foreground/50">{label}:</span>
      <Chip variant="secondary" size="sm" className="text-xs">
        {value}
      </Chip>
    </div>
  );
}

function ConfidenceIndicator({ confianza }: { confianza: string }) {
  const color =
    confianza === "ALTA"
      ? "success"
      : confianza === "MEDIA"
        ? "warning"
        : "danger";
  return (
    <Chip variant="soft" color={color} size="sm" className="text-xs">
      {confianza}
    </Chip>
  );
}

export function StoryAnalyzerResults() {
  const { isLoading, validationError, downloadedContent, conglomerateResult } =
    useStoryAnalyzerResults();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Spinner size="sm" color="current" className="mb-2" />
        <p className="text-sm text-foreground/50">
          Cargando resultados del análisis...
        </p>
      </div>
    );
  }

  if (validationError) {
    return <ValidationErrorAlert validationError={validationError} />;
  }

  if (!conglomerateResult) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-10 h-10 rounded-full bg-default-100 flex items-center justify-center mb-3">
          <svg
            className="w-5 h-5 text-foreground/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Sin resultados</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-foreground/60 mb-1">
          Análisis en progreso
        </p>
        <p className="text-xs text-foreground/40">
          Los resultados aparecerán aquí cuando el análisis finalice.
        </p>
      </div>
    );
  }

  const { sintesis, analisisIndividuales } = conglomerateResult;

  return (
    <div className="space-y-6">
      {/* 1. Story Text */}
      {downloadedContent && <StoryTextViewer content={downloadedContent} />}

      {/* 2. Synthesis Overview (includes text identification + score + verdict) */}
      <SynthesisOverview synthesis={sintesis} />

      {/* 3. Dimension Summary */}
      <DimensionSummary resumenPorDimension={sintesis.resumenPorDimension} />

      {/* 4. Bias Corrections */}
      <BiasCorrections correccionesDeSesgos={sintesis.correccionesDeSesgos} />

      {/* 5. Cross Patterns */}
      <CrossPatterns patronesTransversales={sintesis.patronesTransversales} />

      {/* 6. Strengths, Weaknesses & Improvement Plan */}
      <ImprovementPlan
        planDeMejora={sintesis.planDeMejora}
        fortalezasPrincipales={sintesis.fortalezasPrincipales}
        debilidadesPrincipales={sintesis.debilidadesPrincipales}
      />

      {/* 7. Individual Analysis Details */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          Análisis Individuales
        </h3>
        <Accordion variant="surface" allowsMultipleExpanded>
          {/* Engagement */}
          {analisisIndividuales.engagementStoryAdvisor && (
            <AnalysisDetailCard
              title="Engagement y Apertura"
              veredicto={analisisIndividuales.engagementStoryAdvisor.veredicto}
              criterios={analisisIndividuales.engagementStoryAdvisor.criterios}
              diagnostico={
                analisisIndividuales.engagementStoryAdvisor.diagnostico
              }
              recomendaciones={
                analisisIndividuales.engagementStoryAdvisor.recomendaciones
              }
            >
              <div className="space-y-3">
                {/* Calibration context */}
                <div className="flex flex-wrap gap-2 items-center">
                  <CalibrationChip
                    label="Fuente de enganche"
                    value={
                      analisisIndividuales.engagementStoryAdvisor
                        .fuenteDeEnganche.fuente
                    }
                  />
                  <ConfidenceIndicator
                    confianza={
                      analisisIndividuales.engagementStoryAdvisor
                        .fuenteDeEnganche.confianza
                    }
                  />
                </div>
                <p className="text-xs text-foreground/50">
                  {
                    analisisIndividuales.engagementStoryAdvisor.fuenteDeEnganche
                      .justificacion
                  }
                </p>

                {/* Critical moment */}
                <div>
                  <h5 className="text-sm font-semibold text-foreground">
                    Momento Crítico
                  </h5>
                  <blockquote className="text-sm text-foreground/70 border-l-2 border-accent pl-3 italic">
                    {
                      analisisIndividuales.engagementStoryAdvisor.momentoCritico
                        .cita
                    }
                  </blockquote>
                  <p className="text-xs text-foreground/60">
                    {
                      analisisIndividuales.engagementStoryAdvisor.momentoCritico
                        .analisis
                    }
                  </p>
                </div>
              </div>
            </AnalysisDetailCard>
          )}

          {/* Narrative Structure */}
          {analisisIndividuales.narrativeStructureAnalyzer && (
            <AnalysisDetailCard
              title="Estructura Narrativa"
              veredicto={
                analisisIndividuales.narrativeStructureAnalyzer.veredicto
              }
              criterios={
                analisisIndividuales.narrativeStructureAnalyzer.criterios
              }
              recomendaciones={
                analisisIndividuales.narrativeStructureAnalyzer.recomendaciones
              }
            >
              <div className="space-y-3">
                {/* Structural alignment */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-foreground/50">
                    Encaja limpiamente:
                  </span>
                  <Chip
                    variant="soft"
                    size="sm"
                    color={
                      analisisIndividuales.narrativeStructureAnalyzer
                        .identificacionEstructural.encajaLimpiamente === "SÍ"
                        ? "success"
                        : analisisIndividuales.narrativeStructureAnalyzer
                              .identificacionEstructural.encajaLimpiamente ===
                            "NO"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {
                      analisisIndividuales.narrativeStructureAnalyzer
                        .identificacionEstructural.encajaLimpiamente
                    }
                  </Chip>
                </div>

                {/* Structural levels with alignment % */}
                <div className="space-y-1">
                  {analisisIndividuales.narrativeStructureAnalyzer.identificacionEstructural.niveles.map(
                    (nivel) => (
                      <div
                        key={nivel.nivel}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="text-foreground/50 w-12 shrink-0 text-xs">
                          {nivel.nivel}:
                        </span>
                        <span className="text-foreground/80">
                          {nivel.estructura}
                        </span>
                        {nivel.porcentajeAlineacion != null && (
                          <Chip
                            variant="secondary"
                            size="sm"
                            className="text-xs"
                          >
                            {nivel.porcentajeAlineacion}%
                          </Chip>
                        )}
                      </div>
                    ),
                  )}
                </div>

                {/* Theme & diagnosis */}
                <div>
                  <h5 className="text-sm font-semibold text-foreground">
                    Temática
                  </h5>
                  <p className="text-sm text-foreground/70">
                    <strong>Tema central:</strong>{" "}
                    {
                      analisisIndividuales.narrativeStructureAnalyzer.tematica
                        .temaCentral
                    }
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground/70">
                    Estructura:
                  </span>
                  <Chip
                    variant="soft"
                    size="sm"
                    color={
                      analisisIndividuales.narrativeStructureAnalyzer
                        .diagnostico.aportaOResta === "APORTA"
                        ? "success"
                        : analisisIndividuales.narrativeStructureAnalyzer
                              .diagnostico.aportaOResta === "RESTA"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {
                      analisisIndividuales.narrativeStructureAnalyzer
                        .diagnostico.aportaOResta
                    }
                  </Chip>
                </div>
              </div>
            </AnalysisDetailCard>
          )}

          {/* Continuity Errors */}
          {analisisIndividuales.continuityErrorDetector && (
            <AnalysisDetailCard
              title="Errores de Continuidad"
              veredicto={analisisIndividuales.continuityErrorDetector.veredicto}
              diagnostico={
                analisisIndividuales.continuityErrorDetector.resumenEjecutivo
                  .resumen
              }
            >
              <div className="space-y-3">
                {/* Error counts */}
                <div className="flex gap-2 flex-wrap">
                  <Chip color="danger" variant="soft" size="sm">
                    Críticos:{" "}
                    {
                      analisisIndividuales.continuityErrorDetector
                        .resumenEjecutivo.criticos
                    }
                  </Chip>
                  <Chip color="warning" variant="soft" size="sm">
                    Moderados:{" "}
                    {
                      analisisIndividuales.continuityErrorDetector
                        .resumenEjecutivo.moderados
                    }
                  </Chip>
                  <Chip color="default" variant="soft" size="sm">
                    Menores:{" "}
                    {
                      analisisIndividuales.continuityErrorDetector
                        .resumenEjecutivo.menores
                    }
                  </Chip>
                </div>

                {/* Error classification breakdown */}
                {analisisIndividuales.continuityErrorDetector.erroresDetectados
                  .length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-2">
                      Clasificación de Errores
                    </h5>
                    <div className="space-y-2">
                      {analisisIndividuales.continuityErrorDetector.erroresDetectados.map(
                        (error) => (
                          <div
                            key={error.numero}
                            className="flex items-start gap-2 text-xs"
                          >
                            <Chip
                              size="sm"
                              variant="soft"
                              color={
                                error.clasificacion === "ERROR DE CRAFT"
                                  ? "danger"
                                  : error.clasificacion === "AMBIGUO"
                                    ? "warning"
                                    : "default"
                              }
                              className="shrink-0 text-xs"
                            >
                              {error.clasificacion}
                            </Chip>
                            <Chip
                              size="sm"
                              variant="secondary"
                              className="shrink-0 text-xs"
                            >
                              Capa {error.capa}
                            </Chip>
                            <span className="text-foreground/70">
                              {error.categoria}: {error.analisis}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Correction priorities */}
                {analisisIndividuales.continuityErrorDetector
                  .prioridadesCorreccion.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-1">
                      Prioridades de Corrección
                    </h5>
                    <ul className="space-y-1">
                      {analisisIndividuales.continuityErrorDetector.prioridadesCorreccion.map(
                        (p, i) => (
                          <li
                            key={i}
                            className="text-sm text-foreground/70 flex items-start gap-2"
                          >
                            <span className="text-warning shrink-0 mt-0.5">
                              !
                            </span>
                            {p}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </AnalysisDetailCard>
          )}

          {/* Emotional Resonance */}
          {analisisIndividuales.emotionalResonanceAnalyzer && (
            <AnalysisDetailCard
              title="Resonancia Emocional"
              veredicto={
                analisisIndividuales.emotionalResonanceAnalyzer.veredicto
              }
              criterios={
                analisisIndividuales.emotionalResonanceAnalyzer.criterios
              }
              recomendaciones={
                analisisIndividuales.emotionalResonanceAnalyzer.recomendaciones
              }
            >
              <div className="space-y-3">
                {/* Calibration context: emotional objective */}
                <div className="flex flex-wrap gap-2 items-center">
                  <CalibrationChip
                    label="Objetivo emocional"
                    value={
                      analisisIndividuales.emotionalResonanceAnalyzer
                        .objetivoEmocional.respuesta
                    }
                  />
                  <ConfidenceIndicator
                    confianza={
                      analisisIndividuales.emotionalResonanceAnalyzer
                        .objetivoEmocional.confianza
                    }
                  />
                </div>
                <p className="text-xs text-foreground/50">
                  {
                    analisisIndividuales.emotionalResonanceAnalyzer
                      .objetivoEmocional.justificacion
                  }
                </p>

                {/* Reading category */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground/70">Categoría:</span>
                  <Chip variant="soft" size="sm" color="accent">
                    {
                      analisisIndividuales.emotionalResonanceAnalyzer
                        .diagnosticoEmocional.categoriaLectura
                    }
                  </Chip>
                </div>
                <p className="text-xs text-foreground/60">
                  {analisisIndividuales.emotionalResonanceAnalyzer.notaClave}
                </p>
              </div>
            </AnalysisDetailCard>
          )}

          {/* Character Depth */}
          {analisisIndividuales.characterDepthAnalyzer && (
            <AnalysisDetailCard
              title="Profundidad de Personajes"
              veredicto={analisisIndividuales.characterDepthAnalyzer.veredicto}
              criterios={analisisIndividuales.characterDepthAnalyzer.criterios}
              recomendaciones={[
                ...(analisisIndividuales.characterDepthAnalyzer
                  .recomendacionesProfundidad ?? []),
                ...(analisisIndividuales.characterDepthAnalyzer
                  .recomendacionesDesarrollo ?? []),
              ]}
            >
              <div className="space-y-3">
                {/* Calibration context: character model */}
                <div className="flex flex-wrap gap-2 items-center">
                  <CalibrationChip
                    label="Modelo de personaje"
                    value={
                      analisisIndividuales.characterDepthAnalyzer
                        .modeloPersonaje.modelo
                    }
                  />
                  <ConfidenceIndicator
                    confianza={
                      analisisIndividuales.characterDepthAnalyzer
                        .modeloPersonaje.confianza
                    }
                  />
                </div>
                <p className="text-xs text-foreground/50">
                  {
                    analisisIndividuales.characterDepthAnalyzer.modeloPersonaje
                      .justificacion
                  }
                </p>

                {/* Character profile */}
                <div>
                  <h5 className="text-sm font-semibold text-foreground">
                    Perfil:{" "}
                    {
                      analisisIndividuales.characterDepthAnalyzer
                        .perfilPersonaje.nombre
                    }
                  </h5>
                  <p className="text-xs text-foreground/60">
                    {analisisIndividuales.characterDepthAnalyzer.notaCritica}
                  </p>
                </div>
              </div>
            </AnalysisDetailCard>
          )}

          {/* Prose Discipline */}
          {analisisIndividuales.proseDisciplineAnalyzer && (
            <AnalysisDetailCard
              title="Disciplina de Prosa"
              veredicto={analisisIndividuales.proseDisciplineAnalyzer.veredicto}
              diagnostico={
                analisisIndividuales.proseDisciplineAnalyzer.resumenEjecutivo
                  .descripcion
              }
              recomendaciones={
                analisisIndividuales.proseDisciplineAnalyzer
                  .recomendacionesGenerales
              }
            >
              <div className="space-y-3">
                {/* Register adequacy */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-foreground/50">
                    Registro adecuado:
                  </span>
                  <Chip
                    variant="soft"
                    size="sm"
                    color={
                      analisisIndividuales.proseDisciplineAnalyzer
                        .adecuacionAlRegistro.esAdecuado === "SÍ"
                        ? "success"
                        : analisisIndividuales.proseDisciplineAnalyzer
                              .adecuacionAlRegistro.esAdecuado === "NO"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {
                      analisisIndividuales.proseDisciplineAnalyzer
                        .adecuacionAlRegistro.esAdecuado
                    }
                  </Chip>
                  <Chip variant="secondary" size="sm" className="text-xs">
                    {
                      analisisIndividuales.proseDisciplineAnalyzer
                        .adecuacionAlRegistro.generoTonoIdentificado
                    }
                  </Chip>
                </div>
                <p className="text-xs text-foreground/50">
                  {
                    analisisIndividuales.proseDisciplineAnalyzer
                      .adecuacionAlRegistro.analisis
                  }
                </p>

                {/* Discipline level */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground/70">Nivel:</span>
                  <Chip variant="secondary" size="sm">
                    {
                      analisisIndividuales.proseDisciplineAnalyzer
                        .resumenEjecutivo.nivelDisciplina
                    }
                  </Chip>
                </div>

                {/* Correction priorities */}
                {analisisIndividuales.proseDisciplineAnalyzer
                  .prioridadesCorreccion.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-1">
                      Prioridades
                    </h5>
                    <ul className="space-y-1">
                      {analisisIndividuales.proseDisciplineAnalyzer.prioridadesCorreccion.map(
                        (p, i) => (
                          <li
                            key={i}
                            className="text-sm text-foreground/70 flex items-start gap-2"
                          >
                            <span className="text-warning shrink-0 mt-0.5">
                              !
                            </span>
                            {p}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </AnalysisDetailCard>
          )}

          {/* Pacing & Tension */}
          {analisisIndividuales.pacingTensionAnalyzer && (
            <AnalysisDetailCard
              title="Ritmo y Tensión"
              veredicto={analisisIndividuales.pacingTensionAnalyzer.veredicto}
              criterios={analisisIndividuales.pacingTensionAnalyzer.criterios}
              diagnostico={
                analisisIndividuales.pacingTensionAnalyzer.diagnostico
              }
              recomendaciones={
                analisisIndividuales.pacingTensionAnalyzer.recomendaciones
              }
            >
              <div className="space-y-3">
                {/* Calibration context: tension model */}
                <div className="flex flex-wrap gap-2 items-center">
                  <CalibrationChip
                    label="Modelo de tensión"
                    value={
                      analisisIndividuales.pacingTensionAnalyzer.modeloDeTension
                        .modelo
                    }
                  />
                  <ConfidenceIndicator
                    confianza={
                      analisisIndividuales.pacingTensionAnalyzer.modeloDeTension
                        .confianza
                    }
                  />
                </div>
                <p className="text-xs text-foreground/50">
                  {
                    analisisIndividuales.pacingTensionAnalyzer.modeloDeTension
                      .justificacion
                  }
                </p>

                {/* Temporal distribution */}
                <div>
                  <h5 className="text-sm font-semibold text-foreground">
                    Distribución Temporal
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-default-100">
                      <div className="text-lg font-bold text-foreground">
                        {
                          analisisIndividuales.pacingTensionAnalyzer
                            .distribucionTemporal.escena
                        }
                        %
                      </div>
                      <div className="text-xs text-foreground/60">Escena</div>
                    </div>
                    <div className="p-2 rounded-lg bg-default-100">
                      <div className="text-lg font-bold text-foreground">
                        {
                          analisisIndividuales.pacingTensionAnalyzer
                            .distribucionTemporal.sumario
                        }
                        %
                      </div>
                      <div className="text-xs text-foreground/60">Sumario</div>
                    </div>
                    <div className="p-2 rounded-lg bg-default-100">
                      <div className="text-lg font-bold text-foreground">
                        {
                          analisisIndividuales.pacingTensionAnalyzer
                            .distribucionTemporal.pausa
                        }
                        %
                      </div>
                      <div className="text-xs text-foreground/60">Pausa</div>
                    </div>
                    <div className="p-2 rounded-lg bg-default-100">
                      <div className="text-lg font-bold text-foreground">
                        {
                          analisisIndividuales.pacingTensionAnalyzer
                            .distribucionTemporal.elipsis
                        }
                        %
                      </div>
                      <div className="text-xs text-foreground/60">Elipsis</div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-foreground/60">
                  {analisisIndividuales.pacingTensionAnalyzer.notaCritica}
                </p>
              </div>
            </AnalysisDetailCard>
          )}
        </Accordion>
      </div>
    </div>
  );
}
