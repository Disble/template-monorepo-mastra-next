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
    <div className="w-full px-4 py-8">
      <YoutubeChaptersGenerator />
    </div>
  );
}
