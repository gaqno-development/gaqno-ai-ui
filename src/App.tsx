import { AuthProvider, QueryProvider, TenantProvider, ThemeProvider } from "@gaqno-development/frontcore";
import BooksPage from "./pages/BooksPage";

export default function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <BooksPage />
      </TenantProvider>
    </AuthProvider>
  );
}
