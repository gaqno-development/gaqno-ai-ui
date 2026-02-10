import { lazy } from "react";
import { ShoppingBag, FileText, Film, Send, BarChart } from "lucide-react";
import { SectionWithSubNav } from "@gaqno-development/frontcore/components/SectionWithSubNav";

const ProductProfileTab = lazy(() =>
  import("@/components/ProductProfileSection").then((m) => ({
    default: m.ProductProfileSection,
  }))
);
const ProductContentTab = lazy(() =>
  import("@/components/ProductContentSection").then((m) => ({
    default: m.ProductContentSection,
  }))
);
const VideoTemplateTab = lazy(() =>
  import("@/components/VideoTemplateSection").then((m) => ({
    default: m.VideoTemplateSection,
  }))
);
const DistributionTab = lazy(() =>
  import("@/components/DistributionSection").then((m) => ({
    default: m.DistributionSection,
  }))
);
const AttributionTab = lazy(() =>
  import("@/components/AttributionSection").then((m) => ({
    default: m.AttributionSection,
  }))
);

const RETAIL_CHILDREN = [
  {
    segment: "profile",
    label: "Perfil do Produto",
    href: "/ai/retail/profile",
    icon: ShoppingBag,
  },
  {
    segment: "content",
    label: "Gerar Conteudo",
    href: "/ai/retail/content",
    icon: FileText,
  },
  {
    segment: "video",
    label: "Video de Produto",
    href: "/ai/retail/video",
    icon: Film,
  },
  {
    segment: "distribution",
    label: "Distribuicao",
    href: "/ai/retail/distribution",
    icon: Send,
  },
  {
    segment: "attribution",
    label: "Atribuicao GMV",
    href: "/ai/retail/attribution",
    icon: BarChart,
  },
];

const SEGMENT_TO_COMPONENT = {
  profile: ProductProfileTab,
  content: ProductContentTab,
  video: VideoTemplateTab,
  distribution: DistributionTab,
  attribution: AttributionTab,
};

export default function RetailSection() {
  return (
    <SectionWithSubNav
      basePath="/ai/retail"
      defaultSegment="profile"
      children={RETAIL_CHILDREN}
      segmentToComponent={SEGMENT_TO_COMPONENT}
      title="Retail"
      variant="vertical"
      breadcrumbRoot={{ label: "AI", href: "/ai/books" }}
    />
  );
}
