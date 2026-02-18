import type {
  VideoMode as VideoModeType,
  VideoGenerationStatus as VideoGenerationStatusType,
  VideoModel,
  VideoGenerationRequest,
  VideoGenerationResponse,
  UploadAssetResponse,
} from "@gaqno-development/types/video";

export type {
  VideoModel,
  VideoGenerationRequest,
  VideoGenerationResponse,
  UploadAssetResponse,
};

export type VideoMode = VideoModeType;
export type VideoGenerationStatus = VideoGenerationStatusType;

export const VideoMode = {
  MODIFY_VIDEO: "modify_video",
  USE_VIDEO_REFERENCE: "use_video_reference",
} as const satisfies Record<string, VideoModeType>;

export const VideoGenerationStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const satisfies Record<string, VideoGenerationStatusType>;
