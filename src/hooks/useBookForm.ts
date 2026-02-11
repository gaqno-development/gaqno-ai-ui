import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const bookFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  genre: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  style: z.string().optional().nullable(),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;

export const useBookForm = (
  onSubmit: (data: BookFormValues) => void | Promise<void>,
  defaultValues?: Partial<BookFormValues>
) => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(
    defaultValues?.genre ?? null
  );
  const [selectedStyle, setSelectedStyle] = useState<string | null>(
    defaultValues?.style ?? null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      genre: defaultValues?.genre ?? null,
      description: defaultValues?.description ?? null,
      style: defaultValues?.style ?? null,
    },
  });

  const handleGenreSelect = useCallback(
    (genre: string) => {
      setSelectedGenre(genre);
      setValue("genre", genre);
    },
    [setValue]
  );

  const handleStyleSelect = useCallback(
    (style: string) => {
      setSelectedStyle(style);
      setValue("style", style);
    },
    [setValue]
  );

  return {
    register,
    handleSubmit,
    errors,
    selectedGenre,
    selectedStyle,
    handleGenreSelect,
    handleStyleSelect,
  };
};
