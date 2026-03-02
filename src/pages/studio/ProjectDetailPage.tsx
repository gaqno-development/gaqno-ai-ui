import React from "react";
import { useParams, Link } from "react-router-dom";
import { useVideoProjectQuery } from "@/hooks/studio/useVideoProjects";
import { useSocialAccountsQuery } from "@/hooks/social/useSocialAccounts";
import { usePublishVideoMutation } from "@/hooks/social/useVideoPublish";
import { ArrowLeft, Send } from "lucide-react";

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useVideoProjectQuery(id ?? null);
  const { data: socialAccounts = [] } = useSocialAccountsQuery();
  const publishVideo = usePublishVideoMutation();
  const [selectedAccounts, setSelectedAccounts] = React.useState<string[]>([]);
  const [caption, setCaption] = React.useState("");

  const proj = project as {
    id: string;
    title: string;
    script: string;
    status: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    publishes?: Array<{ platform: string; status: string }>;
  } | null;

  const handlePublish = async () => {
    if (!id || selectedAccounts.length === 0) return;
    await publishVideo.mutateAsync({
      videoId: id,
      socialAccountIds: selectedAccounts,
      caption: caption || undefined,
    });
  };

  if (isLoading || !proj) {
    return (
      <div className="p-4">
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  const accounts = socialAccounts as Array<{ id: string; platform: string; displayName?: string }>;
  const canPublish = proj.status === "completed" && proj.videoUrl;

  return (
    <div className="p-4">
      <Link
        to="/ai/studio"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>
      <h2 className="mb-2 text-lg font-semibold">{proj.title}</h2>
      <p className="mb-4 text-sm capitalize text-muted-foreground">Status: {proj.status}</p>
      {proj.videoUrl && (
        <div className="mb-4">
          <video
            src={proj.videoUrl}
            controls
            className="max-h-80 rounded-lg border"
          />
        </div>
      )}
      {canPublish && (
        <div className="space-y-2 rounded-lg border p-4">
          <h3 className="text-sm font-medium">Publicar</h3>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Legenda (opcional)"
            className="w-full rounded-md border px-3 py-2 text-sm"
            rows={2}
          />
          <div className="flex flex-wrap gap-2">
            {accounts.map((acc) => (
              <label key={acc.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedAccounts.includes(acc.id)}
                  onChange={(e) =>
                    setSelectedAccounts((prev) =>
                      e.target.checked
                        ? [...prev, acc.id]
                        : prev.filter((x) => x !== acc.id)
                    )
                  }
                />
                <span className="text-sm">
                  {acc.platform} {acc.displayName ? `(${acc.displayName})` : ""}
                </span>
              </label>
            ))}
          </div>
          {accounts.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Conecte uma conta em Social para publicar.
            </p>
          )}
          <button
            type="button"
            onClick={handlePublish}
            disabled={publishVideo.isPending || selectedAccounts.length === 0}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {publishVideo.isPending ? "Publicando..." : "Publicar"}
          </button>
        </div>
      )}
      {proj.publishes && proj.publishes.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium">Publicações</h3>
          <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
            {proj.publishes.map((p, i) => (
              <li key={i}>
                {p.platform}: {p.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
