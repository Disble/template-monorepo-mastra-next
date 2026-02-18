import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { StoryAnalyzerHistory } from "#components/story-analyzer/story-analyzer-history";
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
          Historial de análisis realizados.
        </p>
      </div>
      <StoryAnalyzerHistory />
    </div>
  );
}
