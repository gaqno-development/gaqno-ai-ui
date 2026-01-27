import { VideoTab } from './VideoTab';
import { VideoMode } from '@/types/videos/video-types';

export function UseVideoReferenceTab() {
  return <VideoTab mode={VideoMode.USE_VIDEO_REFERENCE} />;
}
