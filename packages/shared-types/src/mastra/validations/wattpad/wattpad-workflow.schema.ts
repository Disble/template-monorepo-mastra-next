import { z } from "zod";

// ============================================================================
// Download Chapter Step
// ============================================================================

export const inputDownloadWattpadChapterSchema = z.object({
  url: z.url(),
  pages: z.number().min(1).max(100).default(1),
  redownload: z.boolean().default(false),
  contextoEditorial: z
    .string()
    .optional()
    .describe(
      "Contexto adicional para el análisis: género, público objetivo, si es primer capítulo o capítulo intermedio, oneshot, etc.",
    ),
});

export const outputDownloadWattpadChapterSchema = z.object({
  content: z.string(),
  contextoEditorial: z
    .string()
    .optional()
    .describe(
      "Contexto editorial proporcionado por el usuario para calibrar el análisis",
    ),
});

// ============================================================================
// Engagement Story Advisor Step
// ============================================================================

const criterioSchema = z.object({
  nombre: z.string().describe("Nombre del criterio evaluado"),
  score: z.number().min(0).max(10).describe("Puntuación de 0 a 10"),
  explicacion: z
    .string()
    .describe("Explicación específica con citas del texto"),
});

export const outputEngamentStoryAdvisorSchema = z.object({
  fuenteDeEnganche: z.object({
    fuente: z
      .string()
      .describe(
        "Fuente primaria de enganche: Conflicto, Voz/Estilo, Humor, Curiosidad temática, Asombro/Escalada u otra",
      ),
    confianza: z
      .enum(["ALTA", "MEDIA", "BAJA"])
      .describe("Confianza en la clasificación"),
    justificacion: z.string().describe("Por qué se identifica esta fuente"),
  }),
  diagnostico: z
    .string()
    .describe(
      "Párrafo explicando si funciona o no la apertura, evaluado desde la fuente de enganche identificada",
    ),
  criterios: z
    .array(criterioSchema)
    .describe(
      "Los 4 criterios evaluados: Anclaje del Lector, Pregunta Implícita, Ritmo de Inversión, Especificidad y Efectividad",
    ),
  momentoCritico: z
    .object({
      cita: z.string().describe("Cita textual del momento crítico"),
      analisis: z
        .string()
        .describe(
          "Análisis de por qué este momento es el punto de inflexión emocional",
        ),
    })
    .describe(
      "El momento específico donde el lector decide seguir leyendo o abandonar",
    ),
  veredicto: z
    .enum(["PASA", "NECESITA REVISIÓN", "NO PASA"])
    .describe("Veredicto editorial"),
  recomendaciones: z
    .array(z.string())
    .describe(
      "2-3 acciones concretas y específicas para fortalecer la apertura (solo si necesita revisión o no pasa)",
    ),
});

// ============================================================================
// Narrative Structure Advisor Step
// ============================================================================

const criterioEstructuralSchema = z.object({
  nombre: z.string().describe("Nombre del criterio evaluado"),
  score: z.number().min(0).max(10).describe("Puntuación de 0 a 10"),
  explicacion: z.string().describe("Explicación con evidencia textual"),
});

const identificacionNivelSchema = z.object({
  nivel: z.enum(["Macro", "Meso", "Micro"]).describe("Nivel estructural"),
  estructura: z.string().describe("Estructura identificada"),
  porcentajeAlineacion: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .describe(
      "Porcentaje de alineación con la estructura identificada. Si no encaja limpiamente, puede ser bajo",
    ),
  justificacion: z.string().describe("Breve justificación"),
});

const puntoEstructuralSchema = z.object({
  tipo: z
    .string()
    .describe(
      "Tipo de punto estructural (inciting incident, punto de giro, clímax, etc.)",
    ),
  cita: z.string().describe("Cita textual del momento"),
  posicionamiento: z
    .string()
    .describe("Análisis de si está bien posicionado o hay problemas de timing"),
});

const tematicaSchema = z.object({
  temaCentral: z
    .string()
    .describe("Cuál es el tema principal que el texto explora"),
  originalidad: z
    .string()
    .describe(
      "¿El enfoque temático es original o convencional? ¿Aporta algo nuevo?",
    ),
  relevancia: z
    .string()
    .describe(
      "¿El tema conecta con preocupaciones humanas universales o de su público?",
    ),
});

export const outputNarrativeStructureAdvisorSchema = z.object({
  identificacionEstructural: z.object({
    niveles: z
      .array(identificacionNivelSchema)
      .describe("Los 3 niveles: Macro, Meso, Micro"),
    encajaLimpiamente: z
      .enum(["SÍ", "PARCIALMENTE", "NO"])
      .describe(
        "Si el texto encaja limpiamente en las estructuras identificadas",
      ),
    descripcion: z
      .string()
      .describe("Descripción de cómo operan estas estructuras en el texto"),
  }),
  criterios: z
    .array(criterioEstructuralSchema)
    .describe(
      "Los 4 criterios: Identificación Estructural, Implementación Técnica, Efectividad Narrativa, Complejidad Justificada",
    ),
  puntosEstructuralesClave: z
    .array(puntoEstructuralSchema)
    .describe("1-5 momentos estructurales clave identificados"),
  tematica: tematicaSchema.describe(
    "Análisis del tema central, su originalidad y relevancia",
  ),
  diagnostico: z.object({
    aportaOResta: z
      .enum(["APORTA", "NEUTRAL", "RESTA"])
      .describe("¿La estructura aporta o resta?"),
    explicacion: z
      .string()
      .describe("Explicación de por qué la estructura funciona o no"),
  }),
  veredicto: z
    .enum(["ESTRUCTURA SÓLIDA", "NECESITA AJUSTES", "NECESITA REPLANTEAMIENTO"])
    .describe("Veredicto editorial"),
  recomendaciones: z
    .array(z.string())
    .describe("2-3 recomendaciones específicas"),
});

// ============================================================================
// Continuity Error Detector Step
// ============================================================================

const errorContinuidadSchema = z.object({
  numero: z.number().describe("Número del error"),
  categoria: z
    .enum([
      "CRONOLOGÍA",
      "CARACTERÍSTICAS FÍSICAS",
      "DETALLES FACTUALES",
      "OBJETOS Y ESPACIOS",
      "REGLAS DEL MUNDO",
      "ACCIONES Y EVENTOS",
      "NARRADOR Y PUNTO DE VISTA",
      "TIEMPOS VERBALES",
    ])
    .describe("Categoría del error"),
  clasificacion: z
    .enum(["ERROR DE CRAFT", "RASGO DEL MODO NARRATIVO", "AMBIGUO"])
    .describe(
      "Clasificación: error de craft (siempre problema), rasgo del modo narrativo (no penalizar), o ambiguo (señalar sin penalizar)",
    ),
  capa: z
    .enum(["1", "5"])
    .describe(
      "Capa afectada: 1 (comprensión básica, grave) o 5 (detalle técnico, menor)",
    ),
  severidad: z
    .enum(["CRÍTICO", "MODERADO", "MENOR", "AMBIGUO"])
    .describe("Nivel de severidad"),
  instancia1: z.object({
    cita: z.string().describe("Cita textual exacta"),
    ubicacion: z.string().describe("Ubicación en el texto"),
  }),
  instancia2: z.object({
    cita: z.string().describe("Cita textual exacta"),
    ubicacion: z.string().describe("Ubicación en el texto"),
  }),
  analisis: z.string().describe("Explicación de por qué es una contradicción"),
  impactoEnLectura: z
    .string()
    .describe("¿Rompe inmersión? ¿Es detectable fácilmente?"),
  solucionSugerida: z
    .string()
    .describe("Cuál versión mantener o cómo armonizarlas"),
});

export const outputContinuityErrorDetectorSchema = z.object({
  resumenEjecutivo: z.object({
    totalErrores: z.number().describe("Total de errores detectados"),
    criticos: z.number().describe("Número de errores críticos"),
    moderados: z.number().describe("Número de errores moderados"),
    menores: z.number().describe("Número de errores menores"),
    ambiguos: z.number().describe("Número de errores ambiguos"),
    resumen: z.string().describe("Párrafo resumen del estado de continuidad"),
  }),
  erroresDetectados: z
    .array(errorContinuidadSchema)
    .describe("Lista de errores detectados"),
  elementosRastreadosCorrectamente: z
    .array(z.string())
    .describe("Elementos que SÍ mantienen continuidad consistente"),
  veredicto: z
    .enum([
      "CONTINUIDAD SÓLIDA",
      "ERRORES MENORES CORREGIBLES",
      "REQUIERE REVISIÓN PROFUNDA",
    ])
    .describe("Veredicto editorial"),
  prioridadesCorreccion: z
    .array(z.string())
    .describe("Errores prioritarios a resolver (hasta 5)"),
  notasAdicionales: z
    .string()
    .optional()
    .describe("Patrones detectados o notas adicionales"),
});

// ============================================================================
// Emotional Resonance Analyzer Step
// ============================================================================

const criterioEmocionalSchema = z.object({
  nombre: z.string().describe("Nombre del criterio evaluado"),
  score: z.number().min(0).max(10).describe("Puntuación de 0 a 10"),
  explicacion: z
    .string()
    .describe("Explicación con evidencia textual específica"),
});

const momentoEmocionalSchema = z.object({
  tipo: z
    .enum(["FUNCIONA", "FALLA"])
    .describe("Si el momento funciona o falla emocionalmente"),
  cita: z.string().describe("Cita breve del momento"),
  analisis: z.string().describe("Por qué genera o no genera emoción"),
  emocion: z
    .string()
    .describe("Qué emoción genera o qué oportunidad emocional se pierde"),
});

const presenciaSensorialSchema = z.object({
  sentidosPresentes: z
    .array(z.string())
    .describe("Sentidos que el texto activa efectivamente"),
  sentidosAusentes: z
    .array(z.string())
    .describe("Sentidos ausentes que enriquecerían la experiencia"),
  analisis: z
    .string()
    .describe(
      "Cómo la presencia/ausencia sensorial afecta la inmersión emocional",
    ),
});

export const outputEmotionalResonanceAnalyzerSchema = z.object({
  objetivoEmocional: z.object({
    respuesta: z
      .string()
      .describe(
        "Respuesta emocional objetivo del texto: Empatía profunda, Tensión, Humor, Asombro, Nostalgia, Inquietud u otra",
      ),
    confianza: z
      .enum(["ALTA", "MEDIA", "BAJA"])
      .describe("Confianza en la clasificación"),
    justificacion: z.string().describe("Por qué se identifica este objetivo"),
  }),
  diagnosticoEmocional: z.object({
    categoriaLectura: z
      .enum(["VISCERAL", "RESONANTE", "PRESENTE", "INFORMATIVA", "INERTE"])
      .describe("Categoría de lectura emocional"),
    descripcion: z
      .string()
      .describe(
        "Qué se siente al leer este texto, experiencia emocional dominante",
      ),
  }),
  criterios: z
    .array(criterioEmocionalSchema)
    .describe(
      "Los 4 criterios: Intensidad Emocional, Variedad Emocional, Autenticidad Emocional, Técnica Emocional",
    ),
  momentosEmocionalesClave: z
    .array(momentoEmocionalSchema)
    .describe("2-6 momentos donde la emoción funciona o falla"),
  presenciaSensorial: presenciaSensorialSchema.describe(
    "Evaluación de qué sentidos activa el texto y cuáles están ausentes",
  ),
  lectorIdeal: z
    .string()
    .describe(
      "Perfil breve del lector que más conectaría con este texto (emocional/experiencial, no comercial)",
    ),
  patronesEmocionales: z
    .array(z.string())
    .describe("1-5 patrones generales identificados en el manejo emocional"),
  veredicto: z
    .enum([
      "EMOCIONALMENTE EFECTIVO",
      "NECESITA PROFUNDIZAR",
      "EMOCIONALMENTE PLANO",
    ])
    .describe("Veredicto editorial"),
  recomendaciones: z
    .array(z.string())
    .describe("2-3 acciones específicas para incrementar resonancia emocional"),
  notaClave: z
    .string()
    .describe("La observación más importante sobre la emocionalidad del texto"),
});

// ============================================================================
// Character Depth Analyzer Step
// ============================================================================

const criterioPersonajeSchema = z.object({
  nombre: z.string().describe("Nombre del criterio evaluado"),
  score: z.number().min(0).max(10).describe("Puntuación de 0 a 10"),
  explicacion: z
    .string()
    .describe("Explicación con evidencia textual específica"),
});

const momentoReveladorSchema = z.object({
  tipo: z
    .enum(["REVELA PROFUNDIDAD", "REVELA FALTA DE PROFUNDIDAD"])
    .describe("Tipo de momento"),
  cita: z.string().describe("Cita textual"),
  analisis: z.string().describe("Qué revela o qué oportunidad se perdió"),
});

const perfilPersonajeSchema = z.object({
  nombre: z.string().describe("Nombre del personaje analizado"),
  primeraImpresion: z
    .string()
    .describe("Cómo se presenta el personaje en superficie"),
  capasDetectadas: z
    .array(z.string())
    .describe("Capas de personalidad de superficie a profundidad"),
  contradiccionesInternas: z
    .array(z.string())
    .describe("Deseos en conflicto, brechas entre máscara y self"),
});

const modeloPersonajeSchema = z.object({
  modelo: z
    .string()
    .describe(
      "Modelo identificado: ARCO, REVELACIÓN, PRUEBA, FUNCIONAL u otro",
    ),
  confianza: z
    .enum(["ALTA", "MEDIA", "BAJA"])
    .describe("Confianza en la clasificación"),
  justificacion: z
    .string()
    .describe("Por qué se identifica este modelo en el texto"),
});

const analisisDesarrolloSchema = z.object({
  estadoInicial: z.string().describe("Quién es el personaje al empezar"),
  presionesQueEnfrenta: z
    .array(z.string())
    .describe("Conflictos/situaciones que actúan sobre el personaje"),
  evidenciaDesarrollo: z
    .string()
    .describe(
      "Según el modelo: transformación (arco), revelación de capas (retrato), demostración bajo presión (prueba), o eficacia funcional (vehículo)",
    ),
  trayectoriaProyectada: z
    .string()
    .describe("Hacia dónde parece dirigirse el personaje"),
  diagnostico: z
    .string()
    .describe("Evaluación según el modelo identificado del personaje"),
});

const personajeSecundarioSchema = z.object({
  nombre: z.string().describe("Nombre del personaje secundario"),
  evaluacion: z
    .string()
    .describe("Si tiene dimensionalidad propia o es puramente funcional"),
});

const analisisDialogoSchema = z.object({
  aportanAlTexto: z
    .enum(["SÍ", "PARCIALMENTE", "NO"])
    .describe("¿Los diálogos aportan al texto?"),
  credibilidad: z
    .string()
    .describe("¿Los diálogos suenan naturales para los personajes?"),
  observacionPrincipal: z
    .string()
    .describe("El hallazgo más relevante sobre los diálogos"),
});

export const outputCharacterDepthAnalyzerSchema = z.object({
  modeloPersonaje: modeloPersonajeSchema.describe(
    "Clasificación del modelo de personaje identificado en el texto",
  ),
  perfilPersonaje: perfilPersonajeSchema,
  criterios: z
    .array(criterioPersonajeSchema)
    .describe(
      "Los 4 criterios: Tridimensionalidad, Construcción y Desarrollo, Coherencia y Credibilidad, Voz Diálogo y Especificidad",
    ),
  momentosReveladores: z
    .array(momentoReveladorSchema)
    .describe("1-6 momentos que revelan profundidad o falta de ella"),
  analisisDesarrollo: analisisDesarrolloSchema.describe(
    "Análisis del desarrollo del personaje según su modelo identificado",
  ),
  analisisDialogo: analisisDialogoSchema.describe(
    "Evaluación breve de la calidad y función de los diálogos",
  ),
  personajesSecundarios: z
    .array(personajeSecundarioSchema)
    .optional()
    .describe("Evaluación de personajes secundarios relevantes"),
  veredicto: z
    .enum([
      "PERSONAJE TRIDIMENSIONAL",
      "NECESITA PROFUNDIZAR",
      "PERSONAJE PLANO",
    ])
    .describe("Veredicto editorial"),
  recomendacionesProfundidad: z
    .array(z.string())
    .describe("2-3 recomendaciones para incrementar profundidad"),
  recomendacionesDesarrollo: z
    .array(z.string())
    .describe("1-2 recomendaciones para potenciar el desarrollo del personaje"),
  notaCritica: z
    .string()
    .describe("La observación más importante sobre este personaje"),
});

// ============================================================================
// Prose Discipline Analyzer Step
// ============================================================================

const ejemploProblemaSchema = z.object({
  cita: z.string().describe("Cita textual del problema"),
  problema: z.string().describe("Descripción del problema"),
  tipo: z
    .enum([
      "VICIO TÉCNICO",
      "ELECCIÓN ESTILÍSTICA DISCUTIBLE",
      "ELECCIÓN ESTILÍSTICA EFECTIVA",
    ])
    .describe(
      "Tipo: vicio técnico (siempre perjudica), elección discutible (funciona en género pero limita), elección efectiva (cumple propósito)",
    ),
  severidad: z
    .enum(["CRÍTICO", "MODERADO", "MENOR"])
    .optional()
    .describe("Nivel de severidad (solo para vicios técnicos)"),
  alternativa: z.string().optional().describe("Alternativa sugerida si aplica"),
});

const adverbioProblemaSchema = z.object({
  cita: z.string().describe("Cita con contexto"),
  severidad: z
    .enum(["CRÍTICO", "MODERADO", "MENOR"])
    .describe("Nivel de severidad"),
  alternativa: z.string().describe("Cómo reescribirlo"),
});

const repeticionSchema = z.object({
  palabra: z.string().describe("Palabra o estructura repetida"),
  veces: z.number().describe("Número de veces en proximidad"),
  ubicaciones: z.string().describe("Citas breves o indicación de ubicaciones"),
  severidad: z
    .enum(["CRÍTICO", "MODERADO", "MENOR"])
    .describe("Nivel de severidad"),
});

export const outputProseDisciplineAnalyzerSchema = z.object({
  adecuacionAlRegistro: z.object({
    esAdecuado: z
      .enum(["SÍ", "PARCIALMENTE", "NO"])
      .describe(
        "¿El lenguaje es adecuado para el tipo de historia y su lector?",
      ),
    generoTonoIdentificado: z
      .string()
      .describe("Género/tono identificado del texto"),
    analisis: z
      .string()
      .describe(
        "Si no es adecuado: por qué no. Si sí: los problemas son de pulido técnico, no de registro",
      ),
  }),
  resumenEjecutivo: z.object({
    nivelDisciplina: z
      .enum([
        "DISCIPLINADO",
        "ALGUNOS EXCESOS",
        "ENGOLOSINAMIENTO NOTABLE",
        "NECESITA EDICIÓN PROFUNDA",
      ])
      .describe("Nivel general de disciplina"),
    descripcion: z.string().describe("Caracterización general de la prosa"),
  }),
  engolosinamiento: z.object({
    hayEngolosinamiento: z
      .enum(["SÍ", "ALGO", "NO"])
      .describe("¿Hay engolosinamiento?"),
    descripcionesOrnamentales: z
      .array(ejemploProblemaSchema)
      .describe("Descripciones ornamentales sin función"),
    juegosAutocomplacientes: z
      .array(ejemploProblemaSchema)
      .describe("Juegos de palabras auto-complacientes"),
    exhibicionismoLexico: z
      .array(ejemploProblemaSchema)
      .describe("Exhibicionismo léxico"),
  }),
  malosHabitosTecnicos: z.object({
    adverbiosMente: z.object({
      frecuenciaTotal: z.number().describe("Total de ocurrencias en el texto"),
      problematicas: z.number().describe("Número de problemáticas"),
      ejemplos: z
        .array(adverbioProblemaSchema)
        .describe("Ejemplos problemáticos"),
    }),
    repeticiones: z.array(repeticionSchema).describe("Repeticiones detectadas"),
    cacofonias: z
      .array(ejemploProblemaSchema)
      .describe("Cacofonías detectadas"),
    inconsistenciasTemporales: z
      .array(ejemploProblemaSchema)
      .describe("Inconsistencias temporales"),
    otrosVicios: z
      .array(ejemploProblemaSchema)
      .describe("Otros vicios detectados"),
  }),
  patronesGenerales: z
    .array(z.string())
    .describe("1-5 patrones sistemáticos identificados"),
  elementosBienEjecutados: z
    .array(z.string())
    .describe("Qué hace bien el autor en disciplina de prosa (hasta 3)"),
  correccionBasica: z
    .object({
      erroresOrtograficos: z
        .array(z.string())
        .describe("Errores ortográficos detectados"),
      erroresPuntuacion: z
        .array(z.string())
        .describe("Errores de puntuación detectados"),
      erroresFormato: z
        .array(z.string())
        .describe(
          "Errores de formato de diálogos, cursivas, mayúsculas detectados",
        ),
      adecuacionRegistro: z
        .string()
        .describe(
          "¿El lenguaje es apropiado para la historia y su público objetivo?",
        ),
    })
    .describe(
      "Check rápido de corrección básica: ortografía, puntuación, formato y registro",
    ),
  veredicto: z
    .enum([
      "PROSA DISCIPLINADA",
      "NECESITA EDICIÓN DE LÍNEA",
      "NECESITA REVISIÓN PROFUNDA",
    ])
    .describe("Veredicto editorial"),
  prioridadesCorreccion: z
    .array(z.string())
    .describe("Problemas prioritarios a resolver (hasta 3)"),
  recomendacionesGenerales: z
    .array(z.string())
    .describe("2-3 consejos generales"),
  notaSobreEstilo: z
    .string()
    .optional()
    .describe("Nota si algunos problemas podrían ser elecciones estilísticas"),
});

// ============================================================================
// Pacing & Tension Analyzer Step
// ============================================================================

const criterioRitmoSchema = z.object({
  nombre: z.string().describe("Nombre del criterio evaluado"),
  score: z.number().min(0).max(10).describe("Puntuacion de 0 a 10"),
  explicacion: z
    .string()
    .describe("Explicacion con evidencia textual especifica"),
});

const distribucionTemporalSchema = z.object({
  escena: z
    .number()
    .min(0)
    .max(100)
    .describe("Porcentaje estimado de escena en el texto"),
  sumario: z
    .number()
    .min(0)
    .max(100)
    .describe("Porcentaje estimado de sumario en el texto"),
  pausa: z
    .number()
    .min(0)
    .max(100)
    .describe("Porcentaje estimado de pausa en el texto"),
  elipsis: z
    .number()
    .min(0)
    .max(100)
    .describe("Porcentaje estimado de elipsis en el texto"),
  observacion: z
    .string()
    .describe(
      "Observacion sobre si la distribucion es adecuada para este tipo de texto",
    ),
});

const interesesNarrativosSchema = z.object({
  suspense: z.string().describe("Presencia y manejo del suspense en el texto"),
  curiosidad: z
    .string()
    .describe("Presencia y manejo de la curiosidad retrospectiva en el texto"),
  sorpresa: z
    .string()
    .describe("Presencia y manejo de sorpresas o giros en el texto"),
});

const puntoTensionSchema = z.object({
  seccion: z.string().describe("Seccion del texto"),
  nivelTension: z
    .number()
    .min(0)
    .max(10)
    .describe("Nivel de tension de 0 a 10"),
  tipo: z
    .enum(["PICO", "VALLE", "MESETA", "ASCENSO", "DESCENSO"])
    .describe("Tipo de punto en la curva de tension"),
});

export const outputPacingTensionAnalyzerSchema = z.object({
  modeloDeTension: z.object({
    modelo: z
      .string()
      .describe(
        "Modelo identificado: CLASICA, ESCALADA ABSURDA, ACUMULACION, CONTRASTE u otro",
      ),
    confianza: z
      .enum(["ALTA", "MEDIA", "BAJA"])
      .describe("Confianza en la clasificacion"),
    justificacion: z.string().describe("Por que se identifica este modelo"),
  }),
  diagnostico: z
    .string()
    .describe(
      "Evaluacion general del sistema ritmico y de tension del texto, en funcion del modelo identificado",
    ),
  criterios: z
    .array(criterioRitmoSchema)
    .describe(
      "Los 3 criterios: Distribucion de Modalidades Temporales, Gestion de Intereses Narrativos, Curva de Tension y Ritmo",
    ),
  distribucionTemporal: distribucionTemporalSchema.describe(
    "Porcentaje estimado por modalidad temporal y observacion",
  ),
  interesesNarrativos: interesesNarrativosSchema.describe(
    "Presencia y gestion de suspense, curiosidad y sorpresa",
  ),
  curvaDeTension: z
    .array(puntoTensionSchema)
    .describe("3+ puntos de la curva de tension a lo largo del texto"),
  veredicto: z
    .enum([
      "RITMO Y TENSION EFECTIVOS",
      "NECESITA AJUSTES DE RITMO",
      "PROBLEMAS SERIOS DE RITMO Y TENSION",
    ])
    .describe("Veredicto editorial"),
  recomendaciones: z
    .array(z.string())
    .describe("2-3 recomendaciones especificas para mejorar ritmo y tension"),
  notaCritica: z
    .string()
    .describe(
      "La observacion mas importante sobre el ritmo y la tension en este texto",
    ),
});

// ============================================================================
// Conglomerate Report Step (Synthesis)
// ============================================================================

const resumenDimensionSchema = z.object({
  dimension: z.string().describe("Nombre de la dimension analizada"),
  veredicto: z.string().describe("Veredicto del analisis individual"),
  scorePromedio: z
    .number()
    .min(0)
    .max(10)
    .describe("Score promedio de los criterios de esta dimension"),
  hallazgoPrincipal: z
    .string()
    .describe("Hallazgo mas importante de esta dimension"),
});

const patronTransversalSchema = z.object({
  patron: z.string().describe("Descripcion del patron identificado"),
  dimensionesAfectadas: z
    .array(z.string())
    .describe("Dimensiones que participan en este patron"),
  impacto: z
    .enum(["ALTO", "MEDIO", "BAJO"])
    .describe("Nivel de impacto del patron"),
  explicacion: z
    .string()
    .describe("Explicacion de la conexion causal entre dimensiones"),
});

const patronNarrativoSchema = z.object({
  patron: z
    .enum(["A", "B", "C", "D", "E"])
    .describe("Patron narrativo identificado: A, B, C, D o E"),
  justificacion: z
    .string()
    .describe(
      "Justificacion breve del patron narrativo segun dimensiones activas",
    ),
  notaFriccionAudiencia: z
    .string()
    .optional()
    .describe(
      "Observacion contextual opcional sobre friccion entre patron y expectativas de audiencia",
    ),
});

const itemMejoraSchema = z.object({
  prioridad: z.number().min(1).max(10).describe("Prioridad del 1 al 10"),
  area: z.string().describe("Area de mejora"),
  recomendacion: z.string().describe("Recomendacion especifica"),
  impactoEsperado: z
    .string()
    .describe("Que otras areas mejoran si se implementa esta recomendacion"),
});

const identificacionTextoSchema = z.object({
  generoYTono: z
    .string()
    .describe(
      "Genero y tono del texto (ficcion literaria, juvenil, humor, horror, parodia, slice of life, etc.)",
    ),
  propositoNarrativo: z
    .string()
    .describe(
      "Que intenta lograr (transformar al personaje, retratar un momento, divertir, provocar reflexion, etc.)",
    ),
  publicoObjetivo: z.string().describe("A quien va dirigido el texto"),
  modeloDePersonaje: z
    .string()
    .describe("Modelo dominante: arco, revelacion, prueba, funcional u otro"),
  fuenteDeEnganche: z
    .string()
    .describe(
      "Fuente primaria: conflicto, humor, voz/estilo, asombro, curiosidad tematica u otra",
    ),
});

const correccionSesgoSchema = z.object({
  agente: z.string().describe("Nombre del agente cuyo score se ajusto"),
  scoreOriginal: z
    .number()
    .min(0)
    .max(10)
    .describe("Score original dado por el agente"),
  scoreAjustado: z
    .number()
    .min(0)
    .max(10)
    .describe("Score ajustado tras la correccion"),
  tipoSesgo: z
    .string()
    .describe(
      "Tipo de sesgo detectado (transformacion, profundidad emocional, consecuencias, anticlimax, modo narrativo)",
    ),
  explicacion: z
    .string()
    .describe("Explicacion breve de por que se ajusto el score"),
});

export const synthesisSchema = z.object({
  identificacionDelTexto: identificacionTextoSchema.describe(
    "Clasificacion del texto realizada por el agente de sintesis antes de ponderar resultados",
  ),
  evaluacionGlobal: z.object({
    scoreGlobal: z
      .number()
      .min(0)
      .max(10)
      .describe(
        "Score global ponderado por jerarquia de capas y tipo de texto",
      ),
    categoria: z.string().describe("Categoria de la obra"),
    resumenEjecutivo: z
      .string()
      .describe("Resumen ejecutivo que captura la esencia del texto"),
  }),
  resumenPorDimension: z
    .array(resumenDimensionSchema)
    .describe("Resumen de cada una de las 7 dimensiones analizadas"),
  correccionesDeSesgos: z
    .array(correccionSesgoSchema)
    .describe(
      "Correcciones de sesgo aplicadas a los scores de los agentes individuales. Puede estar vacio si no se detectaron sesgos",
    ),
  patronesTransversales: z
    .array(patronTransversalSchema)
    .describe("2-7 patrones que conectan multiples dimensiones"),
  patronNarrativo: patronNarrativoSchema.describe(
    "Patron narrativo principal del texto con justificacion y posible nota de friccion",
  ),
  fortalezasPrincipales: z
    .array(z.string())
    .describe("1-5 fortalezas principales de la obra"),
  debilidadesPrincipales: z
    .array(z.string())
    .describe("1-5 debilidades principales de la obra"),
  planDeMejora: z
    .array(itemMejoraSchema)
    .describe("3-10 items del plan de mejora priorizado por impacto"),
  veredictoEditorial: z
    .string()
    .describe(
      "Veredicto editorial final estructurado respondiendo: 1) Se entiende lo que ocurre? 2) Voz, estructura y forma funcionan? 3) Provoca algo en el lector? 4) Hay profundidad? 5) Ejecucion tecnica? 6) Sugerencias priorizadas",
    ),
});

export const outputConglomerateReportSchema = z.object({
  analisisIndividuales: z.object({
    engagementStoryAdvisor: outputEngamentStoryAdvisorSchema.optional(),
    narrativeStructureAnalyzer:
      outputNarrativeStructureAdvisorSchema.optional(),
    continuityErrorDetector: outputContinuityErrorDetectorSchema.optional(),
    emotionalResonanceAnalyzer:
      outputEmotionalResonanceAnalyzerSchema.optional(),
    characterDepthAnalyzer: outputCharacterDepthAnalyzerSchema.optional(),
    proseDisciplineAnalyzer: outputProseDisciplineAnalyzerSchema.optional(),
    pacingTensionAnalyzer: outputPacingTensionAnalyzerSchema.optional(),
  }),
  sintesis: synthesisSchema,
});
