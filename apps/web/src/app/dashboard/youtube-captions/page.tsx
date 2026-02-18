import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { YoutubeHistory } from "#components/youtube-srt/youtube-history";
import { auth } from "#lib/auth";

export default async function YoutubeCaptionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">YouTube Tool</h1>
        <p className="text-sm text-foreground/60 mt-1">
          Historial de ejecuciones de YouTube.
        </p>
      </div>
      <YoutubeHistory />
    </div>
  );
}
