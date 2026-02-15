"use client";

import { Accordion } from "@repo/ui/heroui";
import Markdown from "react-markdown";

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
            <div className="max-h-96 overflow-y-auto prose prose-sm max-w-none text-foreground/80">
              <Markdown>{content}</Markdown>
            </div>
          </Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
