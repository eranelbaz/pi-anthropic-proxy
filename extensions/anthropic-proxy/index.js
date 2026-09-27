import { readFileSync } from "node:fs";
import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { getAgentDir } from "@earendil-works/pi-coding-agent";

const FALLBACK_MODELS = [
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
    id: "claude-opus-5-5",
    name: "Claude Opus 5.5 (anthropic proxy)",
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
];

const MODELS_FETCH_TIMEOUT_MS = 10_000;
const MAX_MODELS_PAGES = 20;
const CACHE_PATH = join(getAgentDir(), "anthropic-proxy-models.json");

// pi resolves the enabledModels scope before refreshModels runs, so the last
// fetched list is cached to make newly released models selectable at startup.
function readCachedModels() {
  try {
    const cached = JSON.parse(readFileSync(CACHE_PATH, "utf8"));
    const models = Array.isArray(cached) ? cached.filter((model) => typeof model?.id === "string") : [];
    return models.length > 0 ? models : undefined;
  } catch {
    return undefined;
  }
}

async function writeCachedModels(models) {
  try {
    await mkdir(dirname(CACHE_PATH), { recursive: true });
    const tmpPath = `${CACHE_PATH}.${process.pid}.tmp`;
    await writeFile(tmpPath, JSON.stringify(models, null, 2));
    await rename(tmpPath, CACHE_PATH);
  } catch (error) {
    console.error(`anthropic-proxy: model cache write failed: ${error.message}`);
  }
}

function joinUrl(baseUrl, path) {
  return `${baseUrl.replace(/\/+$/, "")}${path}`;
}

async function fetchRemoteModels(baseUrl, apiKey, signal) {
  const models = [];
  let afterId;
  let page = 0;
  do {
    const url = new URL(joinUrl(baseUrl, "/v1/models"));
    url.searchParams.set("limit", "1000");
    if (afterId) url.searchParams.set("after_id", afterId);
    const response = await fetch(url, {
      headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      signal: AbortSignal.any([signal, AbortSignal.timeout(MODELS_FETCH_TIMEOUT_MS)]),
    });
    if (!response.ok) throw new Error(`GET /v1/models failed: ${response.status}`);
    const body = await response.json();
    for (const entry of body.data ?? []) {
      if (typeof entry?.id === "string") models.push(entry);
    }
    afterId = body.has_more ? body.last_id : undefined;
  } while (afterId && ++page < MAX_MODELS_PAGES);
  return models;
}

export default function anthropicProxyExtension(pi) {
  pi.registerProvider("anthropic-proxy", {
    baseUrl: process.env.ANTHROPIC_BASE_URL ?? "",
    apiKey: process.env.ANTHROPIC_API_KEY ?? "",
    api: "anthropic-messages",
    models: readCachedModels() ?? FALLBACK_MODELS,
    // /v1/models doesn't report cost/reasoning/input support, so FALLBACK_MODELS
    // fills in those fields for known ids (or generic defaults for unknown ones).
    refreshModels: async (context) => {
      const baseUrl = process.env.ANTHROPIC_BASE_URL;
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!context.allowNetwork || !baseUrl || !apiKey) return undefined;

      let remoteModels;
      try {
        remoteModels = await fetchRemoteModels(baseUrl, apiKey, context.signal);
      } catch (error) {
        if (!context.signal.aborted) {
          console.error(`anthropic-proxy: model refresh failed: ${error.message}`);
        }
        return undefined;
      }
      if (remoteModels.length === 0) return undefined;

      const fallbackById = new Map(FALLBACK_MODELS.map((model) => [model.id, model]));
      const models = remoteModels.map((remote) => {
        const fallback = fallbackById.get(remote.id);
        return {
          id: remote.id,
          name: fallback?.name ?? `${remote.display_name ?? remote.id} (anthropic proxy)`,
          reasoning: fallback?.reasoning ?? true,
          input: fallback?.input ?? ["text", "image"],
          cost: fallback?.cost ?? { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
          contextWindow: fallback?.contextWindow ?? remote.max_input_tokens ?? 200000,
          maxTokens: fallback?.maxTokens ?? remote.max_tokens ?? 64000,
        };
      });
      await writeCachedModels(models);
      return models;
    },
  });
}
