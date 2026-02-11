import { Textarea } from "@gaqno-development/frontcore/components/ui";
import { Button } from "@gaqno-development/frontcore/components/ui";
import { XIcon } from "@gaqno-development/frontcore/components/icons";
import { Save } from "lucide-react";
import { useBlueprintCard } from "@/hooks/useBlueprintCard";
import type { BlueprintCardProps } from "./types";

export function BlueprintCard({
  content,
  isEditing,
  onSave,
}: BlueprintCardProps) {
  const { editedContent, setEditedContent, handleSave, handleCancel } =
    useBlueprintCard(content, isEditing, onSave);

  if (!isEditing) {
    return (
      <div className="prose max-w-none">
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        rows={10}
        className="font-mono text-sm"
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar
        </Button>
        <Button variant="outline" size="sm" onClick={handleCancel}>
          <XIcon className="h-4 w-4 mr-2" size={16} />
          Cancelar
        </Button>
      </div>
    </div>
  );
}
