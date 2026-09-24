# pi-anthropic-proxy

Pi coding agent provider extension for a local Anthropic-compatible proxy (Anthropic Messages API).

## Install

```
pi install npm:pi-anthropic-proxy
```

## What it does

Registers an `anthropic-proxy` provider, reading connection details from env vars:

- `ANTHROPIC_BASE_URL` (required)
- `ANTHROPIC_API_KEY` (required)

On each model refresh, queries `GET /v1/models` on the proxy to pick up new models automatically. Falls back to a static list (`claude-sonnet-5`, `claude-opus-5`, `claude-haiku-4-5`) when the proxy is unreachable or doesn't support that endpoint.

## Requirements

An Anthropic-compatible Messages API proxy reachable at `ANTHROPIC_BASE_URL`, ideally supporting `GET /v1/models`.
