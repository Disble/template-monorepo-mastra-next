"use client";

import { Accordion } from "@repo/ui/heroui";

interface StoryTextViewerProps {
  content: string;
}

export function StoryTextViewer({ content }: StoryTextViewerProps) {
  return (
    <Accordion variant="surface">
      <Accordion.Item>
        <Accordion.Heading>
          <Accordion.Trigger>
            Texto Analizado
            <Accordion.Indicator />
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>
            <div className="max-h-96 overflow-y-auto">
              <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
                {content}
              </p>
            </div>
          </Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
