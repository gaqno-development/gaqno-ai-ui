import { VideoTab } from './VideoTab';
import { VideoMode } from '@/types/videos/video-types';

export function ModifyVideoTab() {
  return <VideoTab mode={VideoMode.MODIFY_VIDEO} />;
}
