"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { z } from "zod";
import { runIdSearchParams } from "#app/search-params";
import { submitContentForm } from "./content-form.action";

const contentTypes = [
  { id: "podcast", label: "Podcast" },
  { id: "lecturas", label: "Lecturas" },
] as const;

const contentTypeIds = contentTypes.map((type) => type.id) as [
  string,
  ...string[],
];

const formSchema = z.object({
  url: z.url({ error: "Ingresa una URL válida" }).nonoptional(),
  contentType: z
    .enum(contentTypeIds, {
      error: "Tipo de contenido no válido",
    })
    .nonoptional(),
});

type FormData = z.infer<typeof formSchema>;

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
      contentType: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form data:", data);
    // Aquí puedes implementar la lógica de envío

    const response = await submitContentForm(data);
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
        name="contentType"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            isRequired
            className="w-full"
            placeholder="Selecciona un tipo"
            isInvalid={!!errors.contentType}
            onChange={(value) => field.onChange(value)}
          >
            <Label>Tipo de Contenido</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Content>
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
            </Select.Content>
            {errors.contentType && (
              <FieldError>{errors.contentType.message}</FieldError>
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
