import {
  Configuration,
  Configurations,
  ICacheClient,
  CacheClient,
  MomentoLogger,
  SetOptions,
  CacheSet as RegionalCacheSet,
  CacheSetResponse as RegionalCacheSetResponse,
} from '@gomomento/sdk';
import {IMultiRegionCacheWriterClient} from './IMultiRegionCacheWriterClient';
import {MultiRegionCacheWriterClientProps} from './multi-region-cache-writer-client-props';
import {MultiRegionCacheSet} from './messages/responses/synchronous';
import {
  validateSomeCredentialsProvided,
  validateTtlSeconds,
} from './internal/utils';

export class MultiRegionCacheWriterClient
  implements IMultiRegionCacheWriterClient
{
  private readonly logger: MomentoLogger;
  private readonly _configuration: Configuration;
  private readonly clients: Record<string, ICacheClient>;
  private readonly regions: string[];

  constructor(props: MultiRegionCacheWriterClientProps) {
    validateTtlSeconds(props.defaultTtlSeconds);
    validateSomeCredentialsProvided(props.credentialProviders);

    const configuration: Configuration =
      props.configuration ?? getDefaultCacheClientConfiguration();
    this._configuration = configuration;

    this.logger = configuration.getLoggerFactory().getLogger(this);
    this.logger.debug('Creating Momento MultiRegionCacheWriterClient');

    this.clients = {};
    this.regions = [];
    for (const [region, credentialProvider] of Object.entries(
      props.credentialProviders
    )) {
      this.clients[region] = new CacheClient({
        configuration,
        credentialProvider,
        defaultTtlSeconds: props.defaultTtlSeconds,
      });
      this.regions.push(region);
    }
  }

  private async executeMultiRegionOperation<T, S, E>({
    cacheOperationFn,
    isSuccessFn,
    successResponseFn,
    errorResponseFn,
  }: {
    cacheOperationFn: (client: ICacheClient) => Promise<T>;
    isSuccessFn: (response: T) => boolean;
    successResponseFn: (successes: Record<string, T>) => S;
    errorResponseFn: (
      successes: Record<string, T>,
      errors: Record<string, T>
    ) => E;
  }): Promise<S | E> {
    const responses = await Promise.all(
      this.regions.map(region => cacheOperationFn(this.clients[region]))
    );

    const successes: Record<string, T> = {};
    const errors: Record<string, T> = {};

    responses.forEach((response, index) => {
      if (isSuccessFn(response)) {
        successes[this.regions[index]] = response;
      } else {
        errors[this.regions[index]] = response;
      }
    });

    if (Object.keys(errors).length > 0) {
      return errorResponseFn(successes, errors);
    } else {
      return successResponseFn(successes);
    }
  }

  public async set(
    cacheName: string,
    key: string | Uint8Array,
    value: string | Uint8Array,
    options?: SetOptions
  ): Promise<MultiRegionCacheSet.Response> {
    return await this.executeMultiRegionOperation({
      cacheOperationFn: client => client.set(cacheName, key, value, options),
      isSuccessFn: response =>
        response.type === RegionalCacheSetResponse.Success,
      successResponseFn: successes =>
        new MultiRegionCacheSet.Success(
          successes as Record<string, RegionalCacheSet.Success>
        ),
      errorResponseFn: (successes, errors) =>
        new MultiRegionCacheSet.Error(
          successes as Record<string, RegionalCacheSet.Success>,
          errors as Record<string, RegionalCacheSet.Error>
        ),
    });
  }

  /**
   * Returns the configuration used to create the MultiRegionCacheWriterClient.
   *
   * @readonly
   * @type {Configuration} - The configuration used to create the MultiRegionCacheWriterClient.
   * @memberof MultiRegionCacheWriterClient
   */
  public get configuration(): Configuration {
    return this._configuration;
  }
}

function getDefaultCacheClientConfiguration(): Configuration {
  const config = Configurations.Laptop.latest();
  const logger = config
    .getLoggerFactory()
    .getLogger('MultiRegionCacheWriterClient');
  logger.info(
    'No configuration provided to MultiRegionCacheWriterClient. Using default "Laptop" configuration, suitable for development. For production use, consider specifying an explicit configuration.'
  );
  return config;
}
