import {v4} from 'uuid';
import {CacheClientProps} from '@gomomento/sdk/dist/src/cache-client-props';
import {
  CacheClient,
  CacheConfiguration,
  Configurations,
  CreateCache,
  CredentialProvider,
  DeleteCache,
  MomentoErrorCode,
} from '@gomomento/sdk';
import {
  IMultiRegionCacheWriterClient,
  MultiRegionCacheWriterClient,
} from '../src';

export function testCacheName(): string {
  const name = process.env.CACHE_NAME || 'js-integration-test-default';
  return name + v4();
}

function regionalMomentoClientForTesting(regionEnvVarName: string) {
  const configuration: CacheConfiguration = Configurations.Laptop.latest();
  const IntegrationTestCacheClientProps: CacheClientProps = {
    configuration,
    credentialProvider: CredentialProvider.fromEnvironmentVariable({
      environmentVariableName: regionEnvVarName,
    }),
    defaultTtlSeconds: 60,
  };
  return new CacheClient(IntegrationTestCacheClientProps);
}

export function SetupIntegrationTest(): {
  client: IMultiRegionCacheWriterClient;
  cacheName: string;
} {
  const cacheName = testCacheName();
  const regionEnvVarNames = [
    'MOMENTO_API_KEY_REGION_1',
    'MOMENTO_API_KEY_REGION_2',
  ];

  beforeAll(async () => {
    for (const regionEnvVarName of regionEnvVarNames) {
      const momento = regionalMomentoClientForTesting(regionEnvVarName);
      const createResponse = await momento.createCache(cacheName);
      if (createResponse instanceof CreateCache.Error) {
        if (
          createResponse.errorCode() !==
          MomentoErrorCode.CACHE_ALREADY_EXISTS_ERROR
        ) {
          throw createResponse.innerException();
        }
      }
    }
  });

  afterAll(async () => {
    for (const regionEnvVarName of regionEnvVarNames) {
      const momento = regionalMomentoClientForTesting(regionEnvVarName);
      const deleteResponse = await momento.deleteCache(cacheName);
      if (deleteResponse instanceof DeleteCache.Error) {
        throw deleteResponse.innerException();
      }
    }
  });

  const client = new MultiRegionCacheWriterClient({
    credentialProviders: {
      'region-1': CredentialProvider.fromEnvVar('MOMENTO_API_KEY_REGION_1'),
      'region-2': CredentialProvider.fromEnvVar('MOMENTO_API_KEY_REGION_2'),
    },
    configuration: Configurations.Laptop.latest(),
    defaultTtlSeconds: 60,
  });

  return {
    client,
    cacheName,
  };
}
