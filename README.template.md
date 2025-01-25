{{ ossHeader }}

# Momento Node.js Multi-Region Writer Client

## What and why?

The Momento Node.js Multi-Region Writer Client enables turnkey multi-region write operations uisng the [Momento Node.js SDK](https://github.com/momentohq/client-sdk-javascript). If your application requires cross-region writes to improve availability or reduce latency, this SDK is designed for you.

## Key Features

- **Multi-region support**: Write to multiple regions in parallel with a single API call.
- **Granular response handling**: Distinguish between successful and failed writes across regions.
- **Familiar interface**: Easily port code written with the Momento Node.js SDK.

## Installation

The client is [available on npm.js](https://www.npmjs.com/package/@gomomento-poc/sdk-multi-region). You can install it via:

```bash
npm install @gomomento/sdk @gomomento-poc/sdk-multi-region
```

Note that the client requires the Momento Node.js SDK as a peer dependency.

## Usage

Using the multi-region writer client is similar to the [Momento Node.js SDK](https://docs.momentohq.com/platform/sdks/nodejs/cache), with additional configuration for multi-region operations:

1. **Specify regions and credentials**: Provide API keys for each region you want to write to.
2. **Configure the multi-region client**: Provide a single Momento Node.js [Configuration](https://docs.momentohq.com/cache/develop/basics/client-configuration-objects) object that will be used identically across all regions.
3. **Handle multi-region responses**: Use built-in accessors to inspect successes and errors across regions.

Here's an example of how to use the SDK:

```typescript
{%include "./examples/multi-region.ts" %}
```

> [!TIP]
> Configure the client timeout to accommodate network latencies between your application and the farthest region. Since the API call waits for all writes to complete before returning, the timeout must account for the region with the longest round-trip time. Use `.withClientTimeoutMillis` on the configuration to adjust this.

{{ ossFooter }}
