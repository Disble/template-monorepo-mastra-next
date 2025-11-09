import type { SearchParams } from "nuqs/server";
import { loadSearchParams } from "#app/search-params";
import { YoutubeChaptersGenerator } from "#components/youtube-chapters-generator";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Home({ searchParams }: PageProps) {
  await loadSearchParams(searchParams);
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <YoutubeChaptersGenerator />
    </div>
  );
}
