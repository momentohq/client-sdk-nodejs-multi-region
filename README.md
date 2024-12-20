<img src="https://docs.momentohq.com/img/momento-logo-forest.svg" alt="logo" width="400"/>

[![project status](https://momentohq.github.io/standards-and-practices/badges/project-status-official.svg)](https://github.com/momentohq/standards-and-practices/blob/main/docs/momento-on-github.md)
[![project stability](https://momentohq.github.io/standards-and-practices/badges/project-stability-alpha.svg)](https://github.com/momentohq/standards-and-practices/blob/main/docs/momento-on-github.md)


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
npm install @gomomento-poc/sdk-multi-region
```

## Usage

Using the multi-region writer client is similar to the [Momento Node.js SDK](https://docs.momentohq.com/platform/sdks/nodejs/cache), with additional configuration for multi-region operations:

1. **Specify regions and credentials**: Provide API keys for each region you want to write to.
2. **Configure the multi-region client**: Provide a single Momento Node.js [Configuration](https://docs.momentohq.com/cache/develop/basics/client-configuration-objects) object that will be used identically across all regions.
3. **Handle multi-region responses**: Use built-in accessors to inspect successes and errors across regions.

Here's an example of how to use the SDK:

```typescript
import {
  Configurations,
  CredentialProvider,
  MultiRegionCacheSetResponse,
  MultiRegionCacheWriterClient,
} from '@gomomento-poc/sdk-multi-region';

async function main(): Promise<void> {
  const client = new MultiRegionCacheWriterClient({
    // Can provide meaningful names for each region
    credentialProviders: {
      'region-1': CredentialProvider.fromEnvVar('MOMENTO_API_KEY_REGION_1'),
      'region-2': CredentialProvider.fromEnvVar('MOMENTO_API_KEY_REGION_2'),
    },
    configuration: Configurations.Laptop.latest(),
    defaultTtlSeconds: 60,
  });
  const cacheName = process.env.MOMENTO_CACHE_NAME ?? 'cache';

  const setResponse = await client.set(cacheName, 'scalar', 'value');
  switch (setResponse.type) {
    case MultiRegionCacheSetResponse.Success:
      console.log('Success:', setResponse.results());
      break;
    case MultiRegionCacheSetResponse.Error:
      console.error(
        `Found ${Object.keys(setResponse.errors()).length} errors and ${
          Object.keys(setResponse.successes()).length
        } successes. Errors:`
      );
      // Handle regional write errors as needed
      for (const [region, error] of Object.entries(setResponse.errors())) {
        console.error(`- ${region}: ${error.toString()}`);
      }
      break;
  }
}

main()
  .then(() => console.log('done'))
  .catch(err => console.error(err));

```

> [!TIP]
> Configure the client timeout to accommodate network latencies between your application and the farthest region. Since the API call waits for all writes to complete before returning, the timeout must account for the region with the longest round-trip time. Use `.withClientTimeoutMillis` on the configuration to adjust this.

----------------------------------------------------------------------------------------
For more info, visit our website at [https://gomomento.com](https://gomomento.com)!
