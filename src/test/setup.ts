import "@testing-library/jest-dom";
import { vi } from "vitest";
import type { ReactNode } from "react";

vi.mock("@gaqno-development/frontcore/i18n", () => ({
  initI18n: vi.fn(),
  I18nProvider: ({ children }: { children: ReactNode }) => children,
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@gaqno-development/frontcore/contexts", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => children,
  TenantProvider: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const mod = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...mod,
    useLocation: () => ({ pathname: "/ai/books" }),
    useNavigate: () => vi.fn(),
  };
});
