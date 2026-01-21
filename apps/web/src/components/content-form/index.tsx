"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  inputYoutubeWorkflow,
  levelModel,
} from "@repo/shared-types/mastra/validations/youtube/youtube-workflow.schema";
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
 * UI configuration for level models
 */
const levelModels = [
  { id: "light" as const, label: "Light" },
  { id: "high" as const, label: "High" },
  { id: "heavy" as const, label: "Heavy" },
] as const;

/**
 * Form schema extending from shared-types schema
 * Uses the same structure as inputYoutubeWorkflow but with better error messages for UI
 */
const formSchema = inputYoutubeWorkflow.extend({
  url: z.url("Ingresa una URL válida"),
  type: z.enum(["reading", "podcast"], {
    message: "Tipo de contenido no válido",
  }),
  levelModel: z.enum(levelModel, {
    message: "Nivel de modelo no válido",
  }),
});

type FormData = InputYoutubeWorkflow;

export function ContentForm() {
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
      levelModel: "high",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form data:", data);
    // Aquí puedes implementar la lógica de envío

    const response = await submitContentForm({
      url: data.url,
      type: data.type,
      levelModel: data.levelModel,
    });
    setQuery({
      runId: response.runId,
    });
  };

  return (
    <Form
      className="flex w-full max-w-md flex-col gap-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-2xl font-bold">Formulario de Contenido</h1>

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

      {/* Level Model Select */}
      <Controller
        name="levelModel"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            isRequired
            className="w-full"
            placeholder="Selecciona un nivel"
            isInvalid={!!errors.levelModel}
            onChange={(value) => field.onChange(value)}
          >
            <Label>Nivel del Modelo</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {levelModels.map((level) => (
                  <ListBox.Item
                    key={level.id}
                    id={level.id}
                    textValue={level.label}
                  >
                    {level.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
            {errors.levelModel && (
              <FieldError>{errors.levelModel.message}</FieldError>
            )}
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
