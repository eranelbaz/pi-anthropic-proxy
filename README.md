# pi-anthropic-proxy

Pi coding agent provider extension for a local Anthropic-compatible proxy (Anthropic Messages API).

## Install

```
pi install https://github.com/eranelbaz/pi-anthropic-proxy
```

## What it does

Registers an `anthropic-proxy` provider, reading connection details from env vars:

- `ANTHROPIC_BASE_URL` (required)
- `ANTHROPIC_API_KEY` (required)

Exposes:

- `claude-sonnet-5`
- `claude-opus-5`
- `claude-haiku-4-5`

## Requirements

An Anthropic-compatible Messages API proxy reachable at `ANTHROPIC_BASE_URL`.
