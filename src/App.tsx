import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AuthProvider,
  QueryProvider,
  TenantProvider,
} from "@gaqno-development/frontcore";
import { BookIcon } from "@gaqno-development/frontcore/components/icons";
import { Music, Image, Video, Database, ShoppingBag } from "lucide-react";
import { AIPageLayout } from "./layouts/AIPageLayout";
import BookPage from "./pages/BookPage";
import AudioSection from "./pages/AudioSection";
import ImagesSection from "./pages/ImagesSection";
import VideoSection from "./pages/VideoSection";
import { ProductDataDiscoveryPage } from "./pages/ProductDataDiscoveryPage";
import RetailSection from "./pages/RetailSection";

const AI_TABS = [
  { id: "books", label: "Books", icon: BookIcon },
  { id: "audio", label: "Audio", icon: Music },
  { id: "images", label: "Images", icon: Image },
  { id: "video", label: "Video", icon: Video },
  { id: "discovery", label: "Discovery", icon: Database },
  { id: "retail", label: "Retail", icon: ShoppingBag },
] as const;

const VIEW_ROUTES: Record<string, string> = {
  books: "/ai/books",
  audio: "/ai/audio/tts",
  images: "/ai/images/text",
  video: "/ai/video/modify",
  discovery: "/ai/discovery",
  retail: "/ai/retail/profile",
};

function viewFromPathname(pathname: string): string | null {
  if (pathname.startsWith("/ai/books")) return "books";
  if (pathname.startsWith("/ai/audio")) return "audio";
  if (pathname.startsWith("/ai/images")) return "images";
  if (pathname.startsWith("/ai/video")) return "video";
  if (pathname.startsWith("/ai/discovery")) return "discovery";
  if (pathname.startsWith("/ai/retail")) return "retail";
  return null;
}

function AIPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const currentView = viewFromPathname(pathname) ?? "books";

  React.useEffect(() => {
    if (pathname === "/ai" || pathname === "/ai/") {
      navigate("/ai/books", { replace: true });
    }
  }, [pathname, navigate]);

  const handleTabChange = (view: string) => {
    const route = VIEW_ROUTES[view] ?? VIEW_ROUTES.books;
    navigate(route);
  };

  const renderView = () => {
    if (pathname.startsWith("/ai/books")) return <BookPage />;
    if (pathname.startsWith("/ai/audio")) return <AudioSection />;
    if (pathname.startsWith("/ai/images")) return <ImagesSection />;
    if (pathname.startsWith("/ai/video")) return <VideoSection />;
    if (pathname.startsWith("/ai/discovery"))
      return <ProductDataDiscoveryPage />;
    if (pathname.startsWith("/ai/retail")) return <RetailSection />;
    if (pathname === "/ai" || pathname === "/ai/") return null;
    return <BookPage />;
  };

  if (pathname === "/ai" || pathname === "/ai/") {
    return null;
  }

  return (
    <AIPageLayout
      tabs={AI_TABS}
      activeTab={currentView}
      onTabChange={handleTabChange}
      title="AI"
    >
      {renderView()}
    </AIPageLayout>
  );
}

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <TenantProvider>
          <AIPage />
        </TenantProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
