interface BuildAnalyzerPromptParams {
  analysisTarget: string;
  rules: string[];
  contextoEditorial?: string;
  content: string;
}

const buildEditorialContextBlock = (contextoEditorial?: string): string => {
  if (!contextoEditorial) {
    return "";
  }

  return `\n**CONTEXTO EDITORIAL (ten en cuenta para calibrar tu análisis):**\n<contexto_editorial>\n${contextoEditorial}\n</contexto_editorial>\n`;
};

const buildStoryTextBlock = (content: string): string => {
  return `**TEXTO A ANALIZAR:**\n<story_text>\n\`\`\`markdown\n${content}\n\`\`\`\n</story_text>`;
};

const buildRulesBlock = (rules: string[]): string => {
  return rules.map((rule) => `- ${rule}`).join("\n");
};

export const buildAnalyzerPrompt = ({
  analysisTarget,
  rules,
  contextoEditorial,
  content,
}: BuildAnalyzerPromptParams): string => {
  const editorialContext = buildEditorialContextBlock(contextoEditorial);
  const storyTextBlock = buildStoryTextBlock(content);
  const rulesBlock = buildRulesBlock(rules);

  return `Aplica estrictamente tu protocolo de calibración de ${analysisTarget} sobre el siguiente texto.

Reglas de ejecución:
${rulesBlock}
${editorialContext}
${storyTextBlock}

Devuelve únicamente la evaluación estructurada compatible con el schema.`;
};
