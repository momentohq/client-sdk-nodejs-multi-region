import {
  Configuration,
  Configurations,
  ICacheClient,
  CacheClient,
  MomentoLogger,
  SetOptions,
  CacheSet as RegionalCacheSet,
} from '@gomomento/sdk';
import {IMultiRegionCacheWriterClient} from './IMultiRegionCacheWriterClient';
import {MultiRegionCacheWriterClientProps} from './multi-region-cache-writer-client-props';
import {MultiRegionCacheSet} from './messages/responses/synchronous';
import {
  validateSomeCredentialsProvided,
  validateTtlSeconds,
} from './internal/utils';
import {mapErrorToUnknownError} from './internal/errors';

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

  public async set(
    cacheName: string,
    key: string | Uint8Array,
    value: string | Uint8Array,
    options?: SetOptions
  ): Promise<MultiRegionCacheSet.Response> {
    try {
      const responses: RegionalCacheSet.Response[] = await Promise.all(
        this.regions.map(region =>
          this.clients[region].set(cacheName, key, value, options)
        )
      );

      const responseRecord: Record<string, RegionalCacheSet.Response> = {};
      responses.forEach((response, index) => {
        responseRecord[this.regions[index]] = response;
      });
      return new MultiRegionCacheSet.Success(responseRecord);
    } catch (error) {
      this.logger.error('Error setting cache item', error);
      return new MultiRegionCacheSet.Error(mapErrorToUnknownError(error));
    }
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
