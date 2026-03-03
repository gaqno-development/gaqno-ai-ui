import React from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { AuthProvider, TenantProvider } from "@gaqno-development/frontcore/contexts";
import { initI18n, I18nProvider } from "@gaqno-development/frontcore/i18n";
import { BookIcon } from "@gaqno-development/frontcore/components/icons";
import { Music, Image, Video, Database, ShoppingBag, LayoutDashboard, Share2 } from "lucide-react";
import { AIPageLayout } from "./AIPageLayout";
import { ChunkLoadErrorBoundary } from "../components/ChunkLoadErrorBoundary";

initI18n();

const AI_TABS = [
  { id: "books", label: "Books", icon: BookIcon, tKey: "ai.books" },
  { id: "audio", label: "Audio", icon: Music, tKey: "ai.audio" },
  { id: "images", label: "Images", icon: Image, tKey: "ai.images" },
  { id: "video", label: "Video", icon: Video, tKey: "ai.video" },
  { id: "studio", label: "Studio", icon: LayoutDashboard, tKey: "ai.studio" },
  { id: "social", label: "Social", icon: Share2, tKey: "ai.social" },
  { id: "discovery", label: "Discovery", icon: Database, tKey: "ai.discovery" },
  { id: "retail", label: "Retail", icon: ShoppingBag, tKey: "ai.retail" },
] as const;

const VIEW_ROUTES: Record<string, string> = {
  books: "/ai/books",
  audio: "/ai/audio",
  images: "/ai/images",
  video: "/ai/video",
  studio: "/ai/studio",
  social: "/ai/social",
  discovery: "/ai/discovery",
  retail: "/ai/retail",
};

function viewFromPathname(pathname: string): string {
  if (pathname.startsWith("/ai/books")) return "books";
  if (pathname.startsWith("/ai/audio")) return "audio";
  if (pathname.startsWith("/ai/images")) return "images";
  if (pathname.startsWith("/ai/video")) return "video";
  if (pathname.startsWith("/ai/studio")) return "studio";
  if (pathname.startsWith("/ai/social")) return "social";
  if (pathname.startsWith("/ai/discovery")) return "discovery";
  if (pathname.startsWith("/ai/retail")) return "retail";
  return "books";
}

export function AIRouteLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const currentView = viewFromPathname(pathname);

  const handleTabChange = (view: string) => {
    const route = VIEW_ROUTES[view] ?? VIEW_ROUTES.books;
    navigate(route);
  };

  return (
    <AuthProvider>
      <TenantProvider>
        <I18nProvider>
          <AIPageLayout
            tabs={AI_TABS}
            activeTab={currentView}
            onTabChange={handleTabChange}
          >
            <ChunkLoadErrorBoundary>
              <Outlet />
            </ChunkLoadErrorBoundary>
          </AIPageLayout>
        </I18nProvider>
      </TenantProvider>
    </AuthProvider>
  );
}

export default AIRouteLayout;
