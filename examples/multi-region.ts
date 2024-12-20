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
