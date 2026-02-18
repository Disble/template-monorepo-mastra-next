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

  const { sintesis: synthesis, analisisIndividuales: individualAnalyses } =
    conglomerateResult;

  return (
    <div className="space-y-6">
      {/* 1. Story Text */}
      {downloadedContent && <StoryTextViewer content={downloadedContent} />}

      {/* 2. Synthesis Overview (includes text identification + score + verdict) */}
      <SynthesisOverview synthesis={synthesis} />

      {/* 3. Dimension Summary */}
      <DimensionSummary dimensionSummary={synthesis.resumenPorDimension} />

      {/* 4. Bias Corrections */}
      <BiasCorrections
        calibrationCorrections={synthesis.correccionesDeSesgos}
      />

      {/* 5. Cross Patterns */}
      <CrossPatterns crossPatterns={synthesis.patronesTransversales} />

      {/* 6. Strengths, Weaknesses & Improvement Plan */}
      <ImprovementPlan
        improvementPlan={synthesis.planDeMejora}
        mainStrengths={synthesis.fortalezasPrincipales}
        mainWeaknesses={synthesis.debilidadesPrincipales}
      />

      {/* 7. Individual Analysis Details */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          Análisis Individuales
        </h3>
        <Accordion variant="surface" allowsMultipleExpanded>
          {/* Engagement */}
          {individualAnalyses.engagementStoryAdvisor && (
            <AnalysisDetailCard
              title="Engagement y Apertura"
              veredicto={individualAnalyses.engagementStoryAdvisor.veredicto}
              criterios={individualAnalyses.engagementStoryAdvisor.criterios}
              diagnostico={
                individualAnalyses.engagementStoryAdvisor.diagnostico
              }
              recomendaciones={
                individualAnalyses.engagementStoryAdvisor.recomendaciones
              }
            >
              <div className="space-y-3">
                {/* Calibration context */}
                <div className="flex flex-wrap gap-2 items-center">
                  <CalibrationChip
                    label="Fuente de enganche"
                    value={
                      individualAnalyses.engagementStoryAdvisor.fuenteDeEnganche
                        .fuente
                    }
                  />
                  <ConfidenceIndicator
                    confianza={
                      individualAnalyses.engagementStoryAdvisor.fuenteDeEnganche
                        .confianza
                    }
                  />
                </div>
                <p className="text-xs text-foreground/50">
                  {
                    individualAnalyses.engagementStoryAdvisor.fuenteDeEnganche
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
                      individualAnalyses.engagementStoryAdvisor.momentoCritico
                        .cita
                    }
                  </blockquote>
                  <p className="text-xs text-foreground/60">
                    {
                      individualAnalyses.engagementStoryAdvisor.momentoCritico
                        .analisis
                    }
                  </p>
                </div>
              </div>
            </AnalysisDetailCard>
          )}

          {/* Narrative Structure */}
          {individualAnalyses.narrativeStructureAnalyzer && (
            <AnalysisDetailCard
              title="Estructura Narrativa"
              veredicto={
                individualAnalyses.narrativeStructureAnalyzer.veredicto
              }
              criterios={
                individualAnalyses.narrativeStructureAnalyzer.criterios
              }
              recomendaciones={
                individualAnalyses.narrativeStructureAnalyzer.recomendaciones
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
                      individualAnalyses.narrativeStructureAnalyzer
                        .identificacionEstructural.encajaLimpiamente === "SÍ"
                        ? "success"
                        : individualAnalyses.narrativeStructureAnalyzer
                              .identificacionEstructural.encajaLimpiamente ===
                            "NO"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {
                      individualAnalyses.narrativeStructureAnalyzer
                        .identificacionEstructural.encajaLimpiamente
                    }
                  </Chip>
                </div>

                {/* Structural levels with alignment % */}
                <div className="space-y-1">
                  {individualAnalyses.narrativeStructureAnalyzer.identificacionEstructural.niveles.map(
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
                      individualAnalyses.narrativeStructureAnalyzer.tematica
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
                      individualAnalyses.narrativeStructureAnalyzer.diagnostico
                        .aportaOResta === "APORTA"
                        ? "success"
                        : individualAnalyses.narrativeStructureAnalyzer
                              .diagnostico.aportaOResta === "RESTA"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {
                      individualAnalyses.narrativeStructureAnalyzer.diagnostico
                        .aportaOResta
                    }
                  </Chip>
                </div>
              </div>
            </AnalysisDetailCard>
          )}

          {/* Continuity Errors */}
          {individualAnalyses.continuityErrorDetector && (
            <AnalysisDetailCard
              title="Errores de Continuidad"
              veredicto={individualAnalyses.continuityErrorDetector.veredicto}
              diagnostico={
                individualAnalyses.continuityErrorDetector.resumenEjecutivo
                  .resumen
              }
            >
              <div className="space-y-3">
                {/* Error counts */}
                <div className="flex gap-2 flex-wrap">
                  <Chip color="danger" variant="soft" size="sm">
                    Críticos:{" "}
                    {
                      individualAnalyses.continuityErrorDetector
                        .resumenEjecutivo.criticos
                    }
                  </Chip>
                  <Chip color="warning" variant="soft" size="sm">
                    Moderados:{" "}
                    {
                      individualAnalyses.continuityErrorDetector
                        .resumenEjecutivo.moderados
                    }
                  </Chip>
                  <Chip color="default" variant="soft" size="sm">
                    Menores:{" "}
                    {
                      individualAnalyses.continuityErrorDetector
                        .resumenEjecutivo.menores
                    }
                  </Chip>
                </div>

                {/* Error classification breakdown */}
                {individualAnalyses.continuityErrorDetector.erroresDetectados
                  .length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-2">
                      Clasificación de Errores
                    </h5>
                    <div className="space-y-2">
                      {individualAnalyses.continuityErrorDetector.erroresDetectados.map(
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
                {individualAnalyses.continuityErrorDetector
                  .prioridadesCorreccion.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-1">
                      Prioridades de Corrección
                    </h5>
                    <ul className="space-y-1">
                      {individualAnalyses.continuityErrorDetector.prioridadesCorreccion.map(
                        (p) => (
                          <li
                            key={p}
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
          {individualAnalyses.emotionalResonanceAnalyzer && (
            <AnalysisDetailCard
              title="Resonancia Emocional"
              veredicto={
                individualAnalyses.emotionalResonanceAnalyzer.veredicto
              }
              criterios={
                individualAnalyses.emotionalResonanceAnalyzer.criterios
              }
              recomendaciones={
                individualAnalyses.emotionalResonanceAnalyzer.recomendaciones
              }
            >
              <div className="space-y-3">
                {/* Calibration context: emotional objective */}
                <div className="flex flex-wrap gap-2 items-center">
                  <CalibrationChip
                    label="Objetivo emocional"
                    value={
                      individualAnalyses.emotionalResonanceAnalyzer
                        .objetivoEmocional.respuesta
                    }
                  />
                  <ConfidenceIndicator
                    confianza={
                      individualAnalyses.emotionalResonanceAnalyzer
                        .objetivoEmocional.confianza
                    }
                  />
                </div>
                <p className="text-xs text-foreground/50">
                  {
                    individualAnalyses.emotionalResonanceAnalyzer
                      .objetivoEmocional.justificacion
                  }
                </p>

                {/* Reading category */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground/70">Categoría:</span>
                  <Chip variant="soft" size="sm" color="accent">
                    {
                      individualAnalyses.emotionalResonanceAnalyzer
                        .diagnosticoEmocional.categoriaLectura
                    }
                  </Chip>
                </div>
                <p className="text-xs text-foreground/60">
                  {individualAnalyses.emotionalResonanceAnalyzer.notaClave}
                </p>
              </div>
            </AnalysisDetailCard>
          )}

          {/* Character Depth */}
          {individualAnalyses.characterDepthAnalyzer && (
            <AnalysisDetailCard
              title="Profundidad de Personajes"
              veredicto={individualAnalyses.characterDepthAnalyzer.veredicto}
              criterios={individualAnalyses.characterDepthAnalyzer.criterios}
              recomendaciones={[
                ...(individualAnalyses.characterDepthAnalyzer
                  .recomendacionesProfundidad ?? []),
                ...(individualAnalyses.characterDepthAnalyzer
                  .recomendacionesDesarrollo ?? []),
              ]}
            >
              <div className="space-y-3">
                {/* Calibration context: character model */}
                <div className="flex flex-wrap gap-2 items-center">
                  <CalibrationChip
                    label="Modelo de personaje"
                    value={
                      individualAnalyses.characterDepthAnalyzer.modeloPersonaje
                        .modelo
                    }
                  />
                  <ConfidenceIndicator
                    confianza={
                      individualAnalyses.characterDepthAnalyzer.modeloPersonaje
                        .confianza
                    }
                  />
                </div>
                <p className="text-xs text-foreground/50">
                  {
                    individualAnalyses.characterDepthAnalyzer.modeloPersonaje
                      .justificacion
                  }
                </p>

                {/* Character profile */}
                <div>
                  <h5 className="text-sm font-semibold text-foreground">
                    Perfil:{" "}
                    {
                      individualAnalyses.characterDepthAnalyzer.perfilPersonaje
                        .nombre
                    }
                  </h5>
                  <p className="text-xs text-foreground/60">
                    {individualAnalyses.characterDepthAnalyzer.notaCritica}
                  </p>
                </div>
              </div>
            </AnalysisDetailCard>
          )}

          {/* Prose Discipline */}
          {individualAnalyses.proseDisciplineAnalyzer && (
            <AnalysisDetailCard
              title="Disciplina de Prosa"
              veredicto={individualAnalyses.proseDisciplineAnalyzer.veredicto}
              diagnostico={
                individualAnalyses.proseDisciplineAnalyzer.resumenEjecutivo
                  .descripcion
              }
              recomendaciones={
                individualAnalyses.proseDisciplineAnalyzer
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
                      individualAnalyses.proseDisciplineAnalyzer
                        .adecuacionAlRegistro.esAdecuado === "SÍ"
                        ? "success"
                        : individualAnalyses.proseDisciplineAnalyzer
                              .adecuacionAlRegistro.esAdecuado === "NO"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {
                      individualAnalyses.proseDisciplineAnalyzer
                        .adecuacionAlRegistro.esAdecuado
                    }
                  </Chip>
                  <Chip variant="secondary" size="sm" className="text-xs">
                    {
                      individualAnalyses.proseDisciplineAnalyzer
                        .adecuacionAlRegistro.generoTonoIdentificado
                    }
                  </Chip>
                </div>
                <p className="text-xs text-foreground/50">
                  {
                    individualAnalyses.proseDisciplineAnalyzer
                      .adecuacionAlRegistro.analisis
                  }
                </p>

                {/* Discipline level */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground/70">Nivel:</span>
                  <Chip variant="secondary" size="sm">
                    {
                      individualAnalyses.proseDisciplineAnalyzer
                        .resumenEjecutivo.nivelDisciplina
                    }
                  </Chip>
                </div>

                {/* Correction priorities */}
                {individualAnalyses.proseDisciplineAnalyzer
                  .prioridadesCorreccion.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-1">
                      Prioridades
                    </h5>
                    <ul className="space-y-1">
                      {individualAnalyses.proseDisciplineAnalyzer.prioridadesCorreccion.map(
                        (p) => (
                          <li
                            key={p}
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
          {individualAnalyses.pacingTensionAnalyzer && (
            <AnalysisDetailCard
              title="Ritmo y Tensión"
              veredicto={individualAnalyses.pacingTensionAnalyzer.veredicto}
              criterios={individualAnalyses.pacingTensionAnalyzer.criterios}
              diagnostico={individualAnalyses.pacingTensionAnalyzer.diagnostico}
              recomendaciones={
                individualAnalyses.pacingTensionAnalyzer.recomendaciones
              }
            >
              <div className="space-y-3">
                {/* Calibration context: tension model */}
                <div className="flex flex-wrap gap-2 items-center">
                  <CalibrationChip
                    label="Modelo de tensión"
                    value={
                      individualAnalyses.pacingTensionAnalyzer.modeloDeTension
                        .modelo
                    }
                  />
                  <ConfidenceIndicator
                    confianza={
                      individualAnalyses.pacingTensionAnalyzer.modeloDeTension
                        .confianza
                    }
                  />
                </div>
                <p className="text-xs text-foreground/50">
                  {
                    individualAnalyses.pacingTensionAnalyzer.modeloDeTension
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
                          individualAnalyses.pacingTensionAnalyzer
                            .distribucionTemporal.escena
                        }
                        %
                      </div>
                      <div className="text-xs text-foreground/60">Escena</div>
                    </div>
                    <div className="p-2 rounded-lg bg-default-100">
                      <div className="text-lg font-bold text-foreground">
                        {
                          individualAnalyses.pacingTensionAnalyzer
                            .distribucionTemporal.sumario
                        }
                        %
                      </div>
                      <div className="text-xs text-foreground/60">Sumario</div>
                    </div>
                    <div className="p-2 rounded-lg bg-default-100">
                      <div className="text-lg font-bold text-foreground">
                        {
                          individualAnalyses.pacingTensionAnalyzer
                            .distribucionTemporal.pausa
                        }
                        %
                      </div>
                      <div className="text-xs text-foreground/60">Pausa</div>
                    </div>
                    <div className="p-2 rounded-lg bg-default-100">
                      <div className="text-lg font-bold text-foreground">
                        {
                          individualAnalyses.pacingTensionAnalyzer
                            .distribucionTemporal.elipsis
                        }
                        %
                      </div>
                      <div className="text-xs text-foreground/60">Elipsis</div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-foreground/60">
                  {individualAnalyses.pacingTensionAnalyzer.notaCritica}
                </p>
              </div>
            </AnalysisDetailCard>
          )}
        </Accordion>
      </div>
    </div>
  );
}
