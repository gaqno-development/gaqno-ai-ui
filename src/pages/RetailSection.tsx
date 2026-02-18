import { lazy } from "react";
import {
  LayoutDashboard,
  Sparkles,
  ShoppingBag,
  FileText,
  Film,
  Send,
  BarChart,
  CreditCard,
} from "lucide-react";
import { SectionWithSubNav } from "@gaqno-development/frontcore/components/SectionWithSubNav";
import type { SectionWithSubNavGroup } from "@gaqno-development/frontcore/components/SectionWithSubNav";

const RetailDashboardTab = lazy(() =>
  import("@/pages/RetailDashboardPage").then((m) => ({
    default: m.default,
  }))
);
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
const BillingTab = lazy(() =>
  import("@/pages/RetailBillingPage").then((m) => ({
    default: m.default,
  }))
);
const ContentStudioTab = lazy(() =>
  import("@/pages/ContentStudioPage").then((m) => ({
    default: m.default,
  }))
);

const RETAIL_NAV_GROUPS: SectionWithSubNavGroup[] = [
  {
    label: "Overview",
    children: [
      {
        segment: "dashboard",
        label: "Dashboard",
        href: "/ai/retail/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Criar Conteudo",
    children: [
      {
        segment: "studio",
        label: "Content Studio (guia)",
        href: "/ai/retail/studio",
        icon: Sparkles,
      },
      {
        segment: "profile",
        label: "Perfil do Produto",
        href: "/ai/retail/profile",
        icon: ShoppingBag,
      },
      {
        segment: "content",
        label: "Texto Marketing",
        href: "/ai/retail/content",
        icon: FileText,
      },
      {
        segment: "video",
        label: "Video Promocional",
        href: "/ai/retail/video",
        icon: Film,
      },
    ],
  },
  {
    label: "Publicar",
    children: [
      {
        segment: "distribution",
        label: "WhatsApp / Canais",
        href: "/ai/retail/distribution",
        icon: Send,
      },
    ],
  },
  {
    label: "Resultados",
    children: [
      {
        segment: "attribution",
        label: "Atribuicao GMV",
        href: "/ai/retail/attribution",
        icon: BarChart,
      },
      {
        segment: "billing",
        label: "Faturamento",
        href: "/ai/retail/billing",
        icon: CreditCard,
      },
    ],
  },
];

const SEGMENT_TO_COMPONENT: Record<string, React.ComponentType> = {
  dashboard: RetailDashboardTab,
  studio: ContentStudioTab,
  profile: ProductProfileTab,
  content: ProductContentTab,
  video: VideoTemplateTab,
  distribution: DistributionTab,
  attribution: AttributionTab,
  billing: BillingTab,
};

export default function RetailSection() {
  return (
    <SectionWithSubNav
      basePath="/ai/retail"
      defaultSegment="dashboard"
      children={[]}
      navGroups={RETAIL_NAV_GROUPS}
      segmentToComponent={SEGMENT_TO_COMPONENT}
      title="Retail AI"
      variant="vertical"
      breadcrumbRoot={{ label: "AI", href: "/ai/books" }}
      enableContentTransition
    />
  );
}
