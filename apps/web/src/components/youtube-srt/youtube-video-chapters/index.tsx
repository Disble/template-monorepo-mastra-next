"use client";

import { Button, Chip, Spinner } from "@repo/ui/heroui";
import { ValidationErrorAlert } from "#components/commons/validation-error-alert";
import {
  calculateTotalDuration,
  copyChaptersToClipboard,
  formatDuration,
} from "./youtube-video-chapters.helper";
import { useYoutubeVideoChapters } from "./youtube-video-chapters.hook";

export function YoutubeVideoChapters() {
  const {
    submitIsLoading,
    validationError,
    chapterSnapshot,
    normalizedChapters,
  } = useYoutubeVideoChapters();

  if (submitIsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Spinner size="sm" color="current" className="mb-2" />
        <p className="text-sm text-foreground/50">Cargando capítulos...</p>
      </div>
    );
  }

  if (validationError) {
    return <ValidationErrorAlert validationError={validationError} />;
  }

  const result = chapterSnapshot?.result;
  const hasChapters =
    result && !Array.isArray(result) && "chapters" in result && result.chapters;

  if (!hasChapters) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-10 h-10 rounded-full bg-default-100 flex items-center justify-center mb-3">
          <svg
            className="w-5 h-5 text-foreground/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Sin capítulos</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-foreground/60 mb-1">
          Sin capítulos
        </p>
        <p className="text-xs text-foreground/40">
          No se generaron capítulos para este video.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable chapter list */}
      <div className="flex-1 space-y-2 max-h-[55vh] overflow-y-auto pr-1 -mr-1">
        {normalizedChapters.map((chapter, index) => (
          <div
            key={chapter.timestamp}
            className="rounded-lg border border-default-200 p-3 hover:bg-content2 transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <Chip
                  variant="secondary"
                  color="accent"
                  className="min-w-[4.5rem] justify-center font-mono text-xs shrink-0"
                >
                  {chapter.timestamp}
                </Chip>
                <span className="text-sm font-medium text-foreground truncate">
                  {chapter.description}
                </span>
              </div>
              <Chip
                variant="secondary"
                color="default"
                className="shrink-0 text-xs"
              >
                {formatDuration(
                  chapter.timestamp,
                  normalizedChapters[index + 1]?.timestamp,
                )}
              </Chip>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-default-200">
        <div className="flex items-center gap-2">
          <Chip variant="secondary" color="accent" className="text-xs">
            {normalizedChapters.length} capítulos
          </Chip>
          {normalizedChapters.length > 1 && (
            <Chip variant="secondary" color="default" className="text-xs">
              ~{calculateTotalDuration(normalizedChapters)} min
            </Chip>
          )}
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="text-xs"
          onPress={() => copyChaptersToClipboard(normalizedChapters)}
        >
          Copiar capítulos
        </Button>
      </div>
    </div>
  );
}
