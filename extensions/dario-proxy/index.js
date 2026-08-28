export default function darioProxyExtension(pi) {
  pi.registerProvider("dario-proxy", {
    baseUrl: "http://localhost:3456",
    apiKey: "dario",
    api: "anthropic-messages",
    models: [
      {
        id: "claude-sonnet-5",
        name: "Claude Sonnet 5 (dario proxy)",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1000000,
        maxTokens: 128000,
      },
      {
        id: "claude-opus-5",
        name: "Claude Opus 5 (dario proxy)",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1000000,
        maxTokens: 128000,
      },
      {
        id: "claude-haiku-4-5",
        name: "Claude Haiku 4.5 (dario proxy)",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 200000,
        maxTokens: 64000,
      },
    ],
  });
}
