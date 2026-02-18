import type { BookFormValues } from "@/hooks/useBookForm";

export type { BookFormValues };

export interface BookFormProps {
  onSubmit: (data: BookFormValues) => void | Promise<void>;
  defaultValues?: Partial<BookFormValues>;
  isLoading?: boolean;
}
