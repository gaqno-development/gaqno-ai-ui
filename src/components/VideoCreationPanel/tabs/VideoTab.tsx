import { VideoCreationPanel } from '../VideoCreationPanel';
import type { VideoMode } from '@/types/videos/video-types';

interface VideoTabProps {
  mode: VideoMode;
}

export function VideoTab({ mode }: VideoTabProps) {
  return <VideoCreationPanel defaultMode={mode} />;
}
