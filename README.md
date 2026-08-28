# pi-anthropic-proxy

Pi coding agent provider extension for a local Anthropic-compatible proxy (Anthropic Messages API).

## Install

```
pi packages add pi-anthropic-proxy
```

## What it does

Registers an `anthropic-proxy` provider, reading connection details from env vars:

- `ANTHROPIC_BASE_URL` (default `http://localhost:3456`)
- `ANTHROPIC_API_KEY` (default `dario`, not a real secret — the proxy is expected to run locally)

Exposes:

- `claude-sonnet-5`
- `claude-opus-5`
- `claude-haiku-4-5`

## Requirements

An Anthropic-compatible Messages API proxy reachable at `ANTHROPIC_BASE_URL`.
