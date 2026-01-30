import { lazy } from 'react';
import { FileDescriptionIcon } from '@gaqno-development/frontcore/components/icons';
import { Video, Film } from 'lucide-react';
import { SectionWithSubNav } from '@gaqno-development/frontcore/components/SectionWithSubNav';

const ModifyVideoTab = lazy(() =>
  import('@/components/VideoCreationPanel/tabs/ModifyVideoTab').then((m) => ({ default: m.ModifyVideoTab }))
);
const UseVideoReferenceTab = lazy(() =>
  import('@/components/VideoCreationPanel/tabs/UseVideoReferenceTab').then((m) => ({ default: m.UseVideoReferenceTab }))
);
const TextToVideoTab = lazy(() =>
  import('@/components/VideoCreationPanel/tabs/TextToVideoTab').then((m) => ({ default: m.TextToVideoTab }))
);

const VIDEO_CHILDREN = [
  { segment: 'modify', label: 'Modificar Vídeo', href: '/ai/video/modify', icon: Video },
  { segment: 'reference', label: 'Usar Referência', href: '/ai/video/reference', icon: Film },
  { segment: 'text', label: 'Texto para Vídeo', href: '/ai/video/text', icon: FileDescriptionIcon },
];

const SEGMENT_TO_COMPONENT = {
  modify: ModifyVideoTab,
  reference: UseVideoReferenceTab,
  text: TextToVideoTab,
};

export default function VideoSection() {
  return (
    <SectionWithSubNav
      basePath="/ai/video"
      defaultSegment="modify"
      children={VIDEO_CHILDREN}
      segmentToComponent={SEGMENT_TO_COMPONENT}
      title="Vídeo"
      variant="vertical"
      breadcrumbRoot={{ label: 'AI', href: '/ai/books' }}
    />
  );
}
