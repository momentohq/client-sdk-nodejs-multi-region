import {v4} from 'uuid';
import {CacheClientProps} from '@gomomento/sdk/dist/src/cache-client-props';
import {
  CacheClient,
  CacheConfiguration,
  Configurations,
  CreateCache,
  CredentialProvider,
  DeleteCacheResponse,
  ICacheClient,
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
  multiRegionClient: IMultiRegionCacheWriterClient;
  regionalClients: Record<string, ICacheClient>;
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
      if (
        deleteResponse.type === DeleteCacheResponse.Error &&
        deleteResponse.errorCode() !== MomentoErrorCode.CACHE_NOT_FOUND_ERROR
      ) {
        throw deleteResponse.innerException();
      }
    }
  });

  const credentialProviders = regionEnvVarNames.reduce(
    (acc, envVarName, index) => {
      acc[`region-${index + 1}`] = CredentialProvider.fromEnvVar(envVarName);
      return acc;
    },
    {} as Record<string, CredentialProvider>
  );
  const multiRegionClient = new MultiRegionCacheWriterClient({
    credentialProviders,
    configuration: Configurations.Laptop.latest(),
    defaultTtlSeconds: 60,
  });

  const regionalClients: Record<string, ICacheClient> = {};
  for (const regionEnvVarName of regionEnvVarNames) {
    const regionalClient = regionalMomentoClientForTesting(regionEnvVarName);
    regionalClients[regionEnvVarName] = regionalClient;
  }

  return {
    multiRegionClient,
    regionalClients,
    cacheName,
  };
}
