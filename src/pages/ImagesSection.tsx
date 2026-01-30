import { lazy } from 'react';
import { FileDescriptionIcon, PenIcon, PaintIcon } from '@gaqno-development/frontcore/components/icons';
import { SectionWithSubNav } from '@gaqno-development/frontcore/components/SectionWithSubNav';

const TextToImageTab = lazy(() => import('@/components/ImageCreationPanel/tabs/TextToImageTab').then((m) => ({ default: m.TextToImageTab })));
const EditImageTab = lazy(() => import('@/components/ImageCreationPanel/tabs/EditImageTab').then((m) => ({ default: m.EditImageTab })));
const InpaintingTab = lazy(() => import('@/components/ImageCreationPanel/tabs/InpaintingTab').then((m) => ({ default: m.InpaintingTab })));

const IMAGE_CHILDREN = [
  { segment: 'text', label: 'Texto para Imagem', href: '/ai/images/text', icon: FileDescriptionIcon },
  { segment: 'edit', label: 'Editar Imagem', href: '/ai/images/edit', icon: PenIcon },
  { segment: 'inpainting', label: 'Inpainting', href: '/ai/images/inpainting', icon: PaintIcon },
];

const SEGMENT_TO_COMPONENT = {
  text: TextToImageTab,
  edit: EditImageTab,
  inpainting: InpaintingTab,
};

export default function ImagesSection() {
  return (
    <SectionWithSubNav
      basePath="/ai/images"
      defaultSegment="text"
      children={IMAGE_CHILDREN}
      segmentToComponent={SEGMENT_TO_COMPONENT}
      title="Imagens"
      variant="vertical"
      breadcrumbRoot={{ label: 'AI', href: '/ai/books' }}
    />
  );
}
