import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { StoryAnalyzerDashboard } from "#components/story-analyzer/story-analyzer-dashboard";
import { auth } from "#lib/auth";

export default async function StoryAnalyzerPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Analizador de Historias
        </h1>
        <p className="text-sm text-foreground/60 mt-1">
          Analiza capítulos de Wattpad con 7 agentes literarios especializados.
        </p>
      </div>
      <StoryAnalyzerDashboard />
    </div>
  );
}
