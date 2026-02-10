"use client";

import { Accordion, Button, Chip } from "@repo/ui/heroui";
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
      <div className="text-center py-12">
        <p className="text-foreground/60">Loading captions...</p>
      </div>
    );
  }

  if (validationError) {
    return <ValidationErrorAlert validationError={validationError} />;
  }

  if (!captions || captions.length === 0) {
    return (
      <div className="text-center py-12">
        <h4 className="text-lg font-medium text-foreground/70 mb-2">
          No captions found
        </h4>
        <p className="text-foreground/60 max-w-md mx-auto">
          No captions were downloaded for this video.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Accordion allowsMultipleExpanded defaultExpandedKeys={["captions-list"]}>
        <Accordion.Item id="captions-list">
          <Accordion.Heading>
            <Accordion.Trigger>
              Captions
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {captions.map((caption, index) => (
                  <div
                    key={`${caption.start}-${index}`}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-content2 transition-colors"
                  >
                    <Chip
                      variant="secondary"
                      color="default"
                      className="min-w-16 justify-center font-mono text-xs shrink-0"
                    >
                      {formatTime(Number.parseFloat(caption.start))}
                    </Chip>
                    <span className="text-sm text-foreground/80 leading-relaxed">
                      {caption.text}
                    </span>
                  </div>
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <div className="flex justify-between items-center pt-3 border-t border-default-200">
        <Chip variant="secondary" color="accent" className="px-3 py-1">
          {captions.length} captions
        </Chip>
        <Button
          variant="secondary"
          size="sm"
          onPress={() => copyCaptionsToClipboard(srtRaw)}
        >
          Copy text
        </Button>
      </div>
    </div>
  );
}
