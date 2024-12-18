import {Configurations, CredentialProvider, MultiRegionCacheWriterClient} from '@gomomento-poc/sdk-nodejs-multi-region';

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
  console.log(response);
}

main()
  .then(() => {
    console.log('success!!');
  })
  .catch((e: Error) => {
    console.error(`Uncaught exception while running example: ${e.message}`);
    throw e;
  });
