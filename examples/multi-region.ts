import {
  Configurations,
  CredentialProvider,
  MultiRegionCacheSetResponse,
  MultiRegionCacheSortedSetPutElementsResponse,
  MultiRegionCacheWriterClient,
} from '@gomomento-poc/sdk-multi-region';

async function main(): Promise<void> {
  const cacheName = process.env.MOMENTO_CACHE_NAME ?? 'test-cache';
  const client = new MultiRegionCacheWriterClient({
    credentialProviders: {
      'region-1': CredentialProvider.fromEnvVar('MOMENTO_API_KEY_REGION_1'),
      'region-2': CredentialProvider.fromEnvVar('MOMENTO_API_KEY_REGION_2'),
    },
    configuration: Configurations.Laptop.latest(),
    defaultTtlSeconds: 60,
  });

  const setResponse = await client.set(cacheName, 'scalar', 'value');
  switch (setResponse.type) {
    case MultiRegionCacheSetResponse.Success:
      console.log('Success:', setResponse.results());
      break;
    case MultiRegionCacheSetResponse.Error:
      console.error(
        `Found {${Object.keys(setResponse.errors()).length}} errors and {${
          Object.keys(setResponse.successes()).length
        }} successes. The full results are: ${setResponse.toString()}`
      );
      break;
  }

  const sortedSetResponse = await client.sortedSetPutElements(cacheName, 'sorted-set', {
    element1: 1,
    element2: 2,
  });
  switch (sortedSetResponse.type) {
    case MultiRegionCacheSortedSetPutElementsResponse.Success:
      console.log('Success:', sortedSetResponse.results());
      break;
    case MultiRegionCacheSortedSetPutElementsResponse.Error:
      console.error(
        `Found {${Object.keys(sortedSetResponse.errors()).length}} errors and {${
          Object.keys(sortedSetResponse.successes()).length
        }} successes. The full results are: ${setResponse.toString()}`
      );
      break;
  }
}

main()
  .then(() => console.log('done'))
  .catch(console.error);
