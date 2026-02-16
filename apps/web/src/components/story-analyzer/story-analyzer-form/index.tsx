"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  FieldError,
  Form,
  Input,
  Label,
  NumberField,
  TextArea,
  TextField,
} from "@repo/ui/heroui";
import { useQueryStates } from "nuqs";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { runIdSearchParams } from "#app/search-params";
import { submitStoryAnalyzerForm } from "./story-analyzer-form.action";

const formSchema = z.object({
  url: z.url("Ingresa una URL válida de Wattpad"),
  pages: z.number().min(1).max(100),
  redownload: z.boolean(),
  contextoEditorial: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface StoryAnalyzerFormProps {
  onSubmitSuccess?: () => void;
}

export function StoryAnalyzerForm({ onSubmitSuccess }: StoryAnalyzerFormProps) {
  const [, setQuery] = useQueryStates(runIdSearchParams);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      pages: 1,
      redownload: false,
      contextoEditorial: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    const response = await submitStoryAnalyzerForm(data);
    if (response.success) {
      setQuery({ runId: response.runId });
      onSubmitSuccess?.();
    }
  };

  return (
    <Form
      className="flex w-full flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="url"
        control={control}
        render={({ field }) => (
          <TextField isInvalid={!!errors.url}>
            <Label htmlFor="url">URL de Wattpad</Label>
            <Input
              {...field}
              id="url"
              type="url"
              placeholder="https://www.wattpad.com/story/..."
            />
            {errors.url && <FieldError>{errors.url.message}</FieldError>}
          </TextField>
        )}
      />

      <Controller
        name="pages"
        control={control}
        render={({ field }) => (
          <NumberField
            isInvalid={!!errors.pages}
            minValue={1}
            maxValue={100}
            value={field.value}
            onChange={field.onChange}
          >
            <Label>Páginas</Label>
            <Input id="pages" />
            {errors.pages && <FieldError>{errors.pages.message}</FieldError>}
          </NumberField>
        )}
      />

      <Controller
        name="contextoEditorial"
        control={control}
        render={({ field }) => (
          <TextField>
            <Label htmlFor="contextoEditorial">
              Contexto editorial (opcional)
            </Label>
            <TextArea
              {...field}
              id="contextoEditorial"
              placeholder="Ej: Es el primer capítulo de una novela de fantasía juvenil para lectores de 14-18 años. El worldbuilding se desarrolla en capítulos posteriores. El género es romance paranormal con elementos de horror."
              rows={4}
            />
          </TextField>
        )}
      />

      <Controller
        name="redownload"
        control={control}
        render={({ field }) => (
          <Checkbox isSelected={field.value} onChange={field.onChange}>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>Re-descargar contenido</Checkbox.Content>
          </Checkbox>
        )}
      />

      <Button
        type="submit"
        className="w-full"
        isDisabled={!isValid || isSubmitting}
      >
        {isSubmitting ? "Analizando..." : "Analizar"}
      </Button>
    </Form>
  );
}
