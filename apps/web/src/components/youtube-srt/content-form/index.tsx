"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { inputYoutubeWorkflow } from "@repo/shared-types/mastra/validations/youtube/youtube-workflow.schema";
import type { InputYoutubeWorkflow } from "@repo/shared-types/mastra/validations/youtube/youtube-workflow.type";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  TextField,
} from "@repo/ui/heroui";
import { useQueryStates } from "nuqs";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { runIdSearchParams } from "#app/search-params";
import { submitContentForm } from "./content-form.action";

/**
 * UI configuration for content types
 * Maps backend values ("reading") to user-friendly labels ("Lecturas")
 */
const contentTypes = [
  { id: "podcast" as const, label: "Podcast" },
  { id: "reading" as const, label: "Lecturas" },
] as const;

/**
 * Form schema extending from shared-types schema
 * Uses the same structure as inputYoutubeWorkflow but with better error messages for UI
 */
const formSchema = inputYoutubeWorkflow.omit({ userId: true }).extend({
  url: z.url("Ingresa una URL válida"),
  type: z.enum(["reading", "podcast"], {
    message: "Tipo de contenido no válido",
  }),
});

type FormData = Omit<InputYoutubeWorkflow, "userId">;

interface ContentFormProps {
  onSubmitSuccess?: () => void;
}

export function ContentForm({ onSubmitSuccess }: ContentFormProps) {
  const [query, setQuery] = useQueryStates(runIdSearchParams);
  console.log("🥒 runId:", query.runId);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      type: "podcast",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form data:", data);
    // Aquí puedes implementar la lógica de envío

    const response = await submitContentForm({
      url: data.url,
      type: data.type,
    });
    setQuery({
      runId: response.runId,
    });
    onSubmitSuccess?.();
  };

  return (
    <Form
      className="flex w-full flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* URL Input */}
      <Controller
        name="url"
        control={control}
        render={({ field }) => (
          <TextField isInvalid={!!errors.url}>
            <Label htmlFor="url">URL</Label>
            <Input
              {...field}
              id="url"
              type="url"
              placeholder="https://example.com"
            />
            {errors.url && <FieldError>{errors.url.message}</FieldError>}
          </TextField>
        )}
      />

      {/* Content Type Select */}
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            isRequired
            className="w-full"
            placeholder="Selecciona un tipo"
            isInvalid={!!errors.type}
            onChange={(value) => field.onChange(value)}
          >
            <Label>Tipo de Contenido</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {contentTypes.map((type) => (
                  <ListBox.Item
                    key={type.id}
                    id={type.id}
                    textValue={type.label}
                  >
                    {type.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
            {errors.type && <FieldError>{errors.type.message}</FieldError>}
          </Select>
        )}
      />

      {/* Submit Button */}
      <Button type="submit" className="w-full" isDisabled={!isValid}>
        Enviar
      </Button>
    </Form>
  );
}
