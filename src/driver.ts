import {
  Configurations,
  CredentialProvider,
  MultiRegionCacheSetResponse,
  MultiRegionCacheWriterClient,
} from '.';

async function main(): Promise<void> {
  const client = new MultiRegionCacheWriterClient({
    credentialProviders: {
      'us-west-2': CredentialProvider.fromEnvVar('MOMENTO_API_KEY_US_WEST_2'),
      'us-east-1': CredentialProvider.fromEnvVar('MOMENTO_API_KEY_US_EAST_1'),
    },
    configuration: Configurations.Laptop.latest(),
    defaultTtlSeconds: 60,
  });
  const response = await client.set('test-cache', 'key', 'value');

  switch (response.type) {
    // TODO this name doesnt convey
    case MultiRegionCacheSetResponse.Success:
      console.log('Success:', response.results());
      break;
    case MultiRegionCacheSetResponse.Error:
      console.error('Error:', response.toString());
      break;
  }
}

main()
  .then(() => console.log('done'))
  .catch(console.error);
