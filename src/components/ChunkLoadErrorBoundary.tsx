import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { Button } from "@gaqno-development/frontcore/components/ui";
import { RefreshCw } from "lucide-react";

function isChunkLoadError(error: unknown): boolean {
  const msg =
    error instanceof Error ? error.message : String(error ?? "");
  return (
    /failed to fetch dynamically imported module/i.test(msg) ||
    /loading chunk \d+ failed/i.test(msg) ||
    /chunkloaderror/i.test(msg) ||
    /loading css chunk \d+ failed/i.test(msg)
  );
}

interface ChunkLoadErrorBoundaryProps {
  children: React.ReactNode;
}

interface ChunkLoadErrorBoundaryState {
  hasChunkError: boolean;
  otherError: unknown;
}

export class ChunkLoadErrorBoundary extends React.Component<
  ChunkLoadErrorBoundaryProps,
  ChunkLoadErrorBoundaryState
> {
  constructor(props: ChunkLoadErrorBoundaryProps) {
    super(props);
    this.state = { hasChunkError: false, otherError: null };
  }

  static getDerivedStateFromError(error: unknown): Partial<ChunkLoadErrorBoundaryState> | null {
    if (isChunkLoadError(error)) return { hasChunkError: true, otherError: null };
    return { otherError: error };
  }

  render(): React.ReactNode {
    if (this.state.otherError) {
      throw this.state.otherError;
    }
    if (this.state.hasChunkError) {
      return (
        <div className="flex items-center justify-center min-h-[280px] p-6">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Nova versão disponível</CardTitle>
              <CardDescription>
                Recarregue a página para carregar a versão mais recente do módulo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => window.location.reload()}
                className="w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Recarregar página
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}
