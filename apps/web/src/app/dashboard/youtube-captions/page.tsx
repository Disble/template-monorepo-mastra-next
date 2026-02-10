import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { YoutubeChaptersGenerator } from "#components/youtube-srt/youtube-chapters-generator";
import { auth } from "#lib/auth";

export default async function DashboardPage() {
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
          Genera capítulos y extrae subtítulos de videos de YouTube.
        </p>
      </div>
      <YoutubeChaptersGenerator />
    </div>
  );
}
