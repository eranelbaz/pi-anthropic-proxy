# pi-dario

Pi coding agent provider extension for a local Dario proxy (Anthropic Messages API compatible).

## Install

```
pi packages add pi-dario
```

## What it does

Registers a `dario-proxy` provider pointing at `http://localhost:3456`, exposing:

- `claude-sonnet-5`
- `claude-opus-5`
- `claude-haiku-4-5`

The API key used (`dario`) is a placeholder, not a real secret — the proxy is expected to run locally.

## Requirements

A Dario-compatible Anthropic Messages proxy listening on `http://localhost:3456`.
