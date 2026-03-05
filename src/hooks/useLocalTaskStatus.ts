import { useQuery } from "@tanstack/react-query";
import { aiApi, type TaskStatusResponse } from "@/utils/api/aiApi";

const TERMINAL_STATUSES = new Set(["completed", "failed", "error"]);

function isTerminal(data: { status?: string } | null): boolean {
  return data?.status != null && TERMINAL_STATUSES.has(data.status);
}

function getPollingInterval(query: {
  state: { data?: unknown; dataUpdatedAt: number };
}): number | false {
  const data = query.state.data as { status?: string } | undefined;
  if (!data || isTerminal(data as { status?: string })) return false;
  const elapsed = Date.now() - query.state.dataUpdatedAt;
  if (elapsed < 30_000) return 3_000;
  if (elapsed < 2 * 60_000) return 5_000;
  if (elapsed < 10 * 60_000) return 10_000;
  return 30_000;
}

export function useLocalTaskStatus(taskId: string | null) {
  return useQuery<TaskStatusResponse | null>({
    queryKey: ["ai", "task-status", taskId],
    queryFn: async () => {
      if (!taskId) return null;
      const result = await aiApi.getTaskStatus(taskId);
      return result;
    },
    enabled: Boolean(taskId),
    staleTime: 0,
    refetchInterval: getPollingInterval,
  });
}
