export default function anthropicProxyExtension(pi) {
  pi.registerProvider("anthropic-proxy", {
    baseUrl: process.env.ANTHROPIC_BASE_URL ?? "http://localhost:3456",
    apiKey: process.env.ANTHROPIC_API_KEY ?? "dario",
    api: "anthropic-messages",
    models: [
      {
        id: "claude-sonnet-5",
        name: "Claude Sonnet 5 (anthropic proxy)",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1000000,
        maxTokens: 128000,
      },
      {
        id: "claude-opus-5",
        name: "Claude Opus 5 (anthropic proxy)",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1000000,
        maxTokens: 128000,
      },
      {
        id: "claude-haiku-4-5",
        name: "Claude Haiku 4.5 (anthropic proxy)",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 200000,
        maxTokens: 64000,
      },
    ],
  });
}
