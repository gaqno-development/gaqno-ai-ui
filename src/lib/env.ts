export function getViteEnv(key: string, defaultValue: string = ""): string {
  if (
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env[key]
  ) {
    return import.meta.env[key] as string;
  }
  return defaultValue;
}

export function getAiServiceBaseUrl(): string {
  const aiServiceUrl = getViteEnv(
    "VITE_SERVICE_AI_URL",
    "https://api.gaqno.com.br/ai"
  );
  return aiServiceUrl.replace(/\/$/, "");
}
