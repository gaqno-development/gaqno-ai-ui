import { useEffect, RefObject } from "react";

export function useScrollToResult(
  resultRef: RefObject<HTMLElement | null>,
  isContentReady: boolean
): void {
  useEffect(() => {
    if (!isContentReady || !resultRef.current) return;
    resultRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [isContentReady, resultRef]);
}
