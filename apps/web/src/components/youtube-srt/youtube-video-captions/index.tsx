"use client";

import { Button, Chip, Spinner } from "@repo/ui/heroui";
import { ValidationErrorAlert } from "#components/commons/validation-error-alert";
import {
  copyCaptionsToClipboard,
  formatTime,
} from "./youtube-video-captions.helper";
import { useYoutubeVideoCaptions } from "./youtube-video-captions.hook";

export function YoutubeVideoCaptions() {
  const { isLoading, captions, srtRaw, validationError } =
    useYoutubeVideoCaptions();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Spinner size="sm" color="current" className="mb-2" />
        <p className="text-sm text-foreground/50">Cargando subtítulos...</p>
      </div>
    );
  }

  if (validationError) {
    return <ValidationErrorAlert validationError={validationError} />;
  }

  if (!captions || captions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-10 h-10 rounded-full bg-default-100 flex items-center justify-center mb-3">
          <svg
            className="w-5 h-5 text-foreground/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Sin subtítulos</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-foreground/60 mb-1">
          Sin subtítulos
        </p>
        <p className="text-xs text-foreground/40">
          No se encontraron subtítulos para este video.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable caption list */}
      <div className="flex-1 space-y-1 max-h-[55vh] overflow-y-auto pr-1 -mr-1">
        {captions.map((caption) => (
          <div
            key={caption.start}
            className="flex items-start gap-3 px-2 py-1.5 rounded-md hover:bg-content2 transition-colors"
          >
            <Chip
              variant="secondary"
              color="default"
              className="min-w-14 justify-center font-mono text-xs shrink-0"
            >
              {formatTime(Number.parseFloat(caption.start))}
            </Chip>
            <span className="text-sm text-foreground/80 leading-relaxed">
              {caption.text}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-default-200">
        <Chip variant="secondary" color="accent" className="text-xs">
          {captions.length} subtítulos
        </Chip>
        <Button
          variant="secondary"
          size="sm"
          className="text-xs"
          onPress={() => copyCaptionsToClipboard(srtRaw)}
        >
          Copiar texto
        </Button>
      </div>
    </div>
  );
}
