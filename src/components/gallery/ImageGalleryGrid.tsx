import React, { useState, useCallback } from "react";
import { Skeleton, EmptyState } from "@gaqno-development/frontcore/components/ui";
import { Image as ImageIcon } from "lucide-react";
import { ImageCard } from "./ImageCard";
import {
  useGalleryImagesQuery,
  useMoveGalleryImageMutation,
  useDeleteGalleryImageMutation,
  useImageFoldersQuery,
} from "@/hooks/gallery";
import type { ImageGalleryItemDto, ImageFolderDto } from "@/utils/api/aiApi";

interface ImageGalleryGridProps {
  folderId: string | null | undefined;
  onCopyUrl?: (url: string) => void;
  draggingImageId: string | null;
  onDragStart: (e: React.DragEvent, imageId: string) => void;
  onDragEnd: () => void;
}

export function ImageGalleryGrid({
  folderId,
  onCopyUrl,
  draggingImageId,
  onDragStart,
  onDragEnd,
}: ImageGalleryGridProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: imagesData, isLoading: imagesLoading } = useGalleryImagesQuery({
    folderId,
    page: 1,
    limit: 50,
  });
  const { data: folders = [], isLoading: foldersLoading } =
    useImageFoldersQuery();
  const moveImage = useMoveGalleryImageMutation();
  const deleteImage = useDeleteGalleryImageMutation();

  const items = (imagesData?.items ?? []) as ImageGalleryItemDto[];
  const folderList = folders as ImageFolderDto[];

  const getFolderName = useCallback(
    (folderId: string | null) =>
      folderId ? folderList.find((f) => f.id === folderId)?.name ?? null : null,
    [folderList]
  );

  const handleMove = useCallback(
    (imageId: string, targetFolderId: string | null) => {
      moveImage.mutate({ id: imageId, folderId: targetFolderId });
    },
    [moveImage]
  );

  const handleDelete = useCallback(
    (imageId: string) => {
      setDeletingId(imageId);
      deleteImage.mutate(imageId, {
        onSettled: () => setDeletingId(null),
      });
    },
    [deleteImage]
  );

  const handleCopy = useCallback(
    (url: string) => {
      navigator.clipboard.writeText(url).catch(() => {});
      onCopyUrl?.(url);
    },
    [onCopyUrl]
  );

  if (imagesLoading || foldersLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-video rounded-lg" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ImageIcon}
        title="Nenhuma imagem ainda"
        description="Gere imagens em AI → Imagens e escolha sua favorita para salvar na galeria."
      />
    );
  }

  return (
    <div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      onDragEnd={onDragEnd}
    >
      {items.map((item) => (
        <ImageCard
          key={item.id}
          item={item}
          folders={folderList}
          folderName={getFolderName(item.folderId)}
          onCopyUrl={handleCopy}
          onMove={handleMove}
          onDelete={handleDelete}
          isDragging={draggingImageId === item.id}
          onDragStart={onDragStart}
        />
      ))}
    </div>
  );
}
