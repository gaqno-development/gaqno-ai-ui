import React, { useState } from "react";
import {
  Card,
  CardContent,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@gaqno-development/frontcore/components/ui";
import { Download, Copy, FolderInput, Trash2, MoreVertical } from "lucide-react";
import type { ImageGalleryItemDto } from "@/utils/api/aiApi";
import type { ImageFolderDto } from "@/utils/api/aiApi";

interface ImageCardProps {
  item: ImageGalleryItemDto;
  folders: ImageFolderDto[];
  folderName: string | null;
  onCopyUrl: (url: string) => void;
  onMove: (imageId: string, folderId: string | null) => void;
  onDelete: (imageId: string) => void;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent, imageId: string) => void;
}

export function ImageCard({
  item,
  folders,
  folderName,
  onCopyUrl,
  onMove,
  onDelete,
  isDragging,
  onDragStart,
}: ImageCardProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    onCopyUrl(item.url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const promptExcerpt =
    item.prompt.length > 60 ? `${item.prompt.slice(0, 60)}…` : item.prompt;
  const dateStr = new Date(item.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-md ${
        isDragging ? "opacity-50" : ""
      }`}
      draggable={Boolean(onDragStart)}
      onDragStart={onDragStart ? (e) => onDragStart(e, item.id) : undefined}
    >
      <div className="relative aspect-video bg-muted/50">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full w-full"
        >
          <img
            src={item.url}
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
          />
        </a>
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                {copySuccess ? "Copiado!" : "Copiar URL"}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href={item.url}
                  download={`image-${item.id.slice(0, 8)}.png`}
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="flex flex-col items-stretch p-0"
              >
                <span className="px-2 py-1.5 text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <FolderInput className="h-3 w-3" />
                  Mover para
                </span>
                <button
                  type="button"
                  className="px-2 py-1.5 text-left text-sm hover:bg-accent"
                  onClick={() => onMove(item.id, null)}
                >
                  Sem pasta
                </button>
                {folders.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="px-2 py-1.5 text-left text-sm hover:bg-accent"
                    onClick={() => onMove(item.id, f.id)}
                  >
                    {f.name}
                  </button>
                ))}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {promptExcerpt}
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          {folderName && <span>{folderName}</span>}
          <span>·</span>
          <span>{dateStr}</span>
        </div>
      </CardContent>
    </Card>
  );
}
