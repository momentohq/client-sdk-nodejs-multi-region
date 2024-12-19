import {
  Configurations,
  CredentialProvider,
  MultiRegionCacheSetResponse,
  MultiRegionCacheSortedSetPutElementsResponse,
  MultiRegionCacheWriterClient,
} from '.';

async function main(): Promise<void> {
  const client = new MultiRegionCacheWriterClient({
    credentialProviders: {
      'region-1': CredentialProvider.fromEnvVar('MOMENTO_API_KEY_REGION_1'),
      'region-2': CredentialProvider.fromEnvVar('MOMENTO_API_KEY_REGION_2'),
    },
    configuration: Configurations.Laptop.latest(),
    defaultTtlSeconds: 60,
  });

  const setResponse = await client.set('test-cache', 'scalar', 'value');
  switch (setResponse.type) {
    case MultiRegionCacheSetResponse.Success:
      console.log('Success:', setResponse.results());
      break;
    case MultiRegionCacheSetResponse.Error:
      console.error('Error:', setResponse.toString());
      break;
  }

  const sortedSetResponse = await client.sortedSetPutElements(
    'test-cache',
    'sorted-set',
    {
      element1: 1,
      element2: 2,
    }
  );
  switch (sortedSetResponse.type) {
    case MultiRegionCacheSortedSetPutElementsResponse.Success:
      console.log('Success:', sortedSetResponse.results());
      break;
    case MultiRegionCacheSortedSetPutElementsResponse.Error:
      console.error('Error:', sortedSetResponse.toString());
      break;
  }
}

main()
  .then(() => console.log('done'))
  .catch(console.error);
