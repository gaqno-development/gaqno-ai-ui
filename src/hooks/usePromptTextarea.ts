import { useState, useCallback } from "react";

export const PROMPT_EXAMPLES = [
  "Add dramatic lighting to the scene",
  "Change the background to a futuristic city",
  "Make the colors more vibrant and saturated",
  "Add slow motion effect",
  "Transform the scene to sunset",
  "Add cinematic depth of field",
];

export const usePromptTextarea = (onChange: (value: string) => void) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExampleClick = useCallback(
    (example: string) => {
      onChange(example);
      setIsOpen(false);
    },
    [onChange]
  );

  return {
    isOpen,
    onOpenChange: setIsOpen,
    handleExampleClick,
    PROMPT_EXAMPLES,
  };
};
