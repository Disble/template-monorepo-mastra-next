"use client";

import { Accordion, Button, Card, Chip } from "@repo/ui/heroui";
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
      <div className="text-center py-12">
        <p className="text-foreground/60">Loading chapters...</p>
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
      <div className="text-center py-12">
        <h4 className="text-lg font-medium text-foreground/70 mb-2">
          No chapters found
        </h4>
        <p className="text-foreground/60 max-w-md mx-auto">
          No chapters were generated for this video.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Accordion allowsMultipleExpanded defaultExpandedKeys={["chapters-list"]}>
        <Accordion.Item id="chapters-list">
          <Accordion.Heading>
            <Accordion.Trigger>
              Chapters
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {normalizedChapters.map((chapter, index) => (
                  <Card
                    key={`${chapter.timestamp}-${index}`}
                    className="bg-content1 border border-default-200 hover:bg-content2 transition-colors"
                  >
                    <div className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Chip
                            variant="secondary"
                            color="accent"
                            className="min-w-20 justify-center font-mono"
                          >
                            {chapter.timestamp}
                          </Chip>
                          <span className="font-medium text-foreground">
                            {chapter.description}
                          </span>
                        </div>
                        <Chip
                          variant="secondary"
                          color="default"
                          className="self-start sm:self-auto"
                        >
                          {formatDuration(
                            chapter.timestamp,
                            normalizedChapters[index + 1]?.timestamp,
                          )}
                        </Chip>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <div className="flex justify-between items-center pt-3 border-t border-default-200">
        <div className="flex items-center gap-2">
          <Chip variant="secondary" color="accent" className="px-3 py-1">
            {normalizedChapters.length} chapters
          </Chip>
          {normalizedChapters.length > 1 && (
            <Chip variant="secondary" color="default" className="px-3 py-1">
              ~{calculateTotalDuration(normalizedChapters)} min
            </Chip>
          )}
        </div>
        <Button
          variant="secondary"
          size="sm"
          onPress={() => copyChaptersToClipboard(normalizedChapters)}
        >
          Copy chapters
        </Button>
      </div>
    </div>
  );
}
