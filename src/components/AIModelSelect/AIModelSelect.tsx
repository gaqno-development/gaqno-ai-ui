import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gaqno-development/frontcore/components/ui';
import { useAIModels } from '@/hooks/ai';

export interface AIModelSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  loadingPlaceholder?: string;
  className?: string;
}

export function AIModelSelect({
  value,
  onValueChange,
  placeholder = 'Selecione o modelo',
  loadingPlaceholder = 'Carregando...',
  className,
}: AIModelSelectProps) {
  const { data: models = [], isLoading } = useAIModels();

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={isLoading ? loadingPlaceholder : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.id}
            {model.provider ? ` (${model.provider})` : ''}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
