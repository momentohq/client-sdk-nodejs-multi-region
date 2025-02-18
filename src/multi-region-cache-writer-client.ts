import {
  Configuration,
  Configurations,
  ICacheClient,
  CacheClient,
  MomentoLogger,
  SetOptions,
  CacheSet as RegionalCacheSet,
  CacheSetResponse as RegionalCacheSetResponse,
  CacheDictionarySetField as RegionalCacheDictionarySetField,
  CacheDictionarySetFieldResponse as RegionalCacheDictionarySetFieldResponse,
  CacheSortedSetPutElements as RegionalCacheSortedSetPutElements,
  CacheSortedSetPutElementsResponse as RegionalCacheSortedSetPutElementsResponse,
  SortedSetPutElementsOptions,
  DictionarySetFieldOptions,
} from '@gomomento/sdk';
import {IMultiRegionCacheWriterClient} from './IMultiRegionCacheWriterClient';
import {
  MultiRegionCacheWriterClientProps,
  MultiRegionCacheWriterClientPropsFromClients,
  MultiRegionCacheWriterClientPropsFromConfiguration,
} from './multi-region-cache-writer-client-props';
import {
  MultiRegionCacheSet,
  MultiRegionCacheDictionarySetField,
  MultiRegionCacheSortedSetPutElements,
} from './messages/responses/synchronous';
import {
  validateSomeClientsProvided,
  validateSomeCredentialsProvided,
  validateTtlSeconds,
} from './internal/utils';

/**
 * A client for writing to the same cache in multiple regions.
 */
export class MultiRegionCacheWriterClient
  implements IMultiRegionCacheWriterClient
{
  private readonly logger: MomentoLogger;
  private readonly clients: Record<string, ICacheClient>;
  private readonly regions: string[];

  constructor(props: MultiRegionCacheWriterClientProps) {
    if (this.isPropsFromClients(props)) {
      validateSomeClientsProvided(props.clients);

      this.clients = props.clients;
      this.regions = Object.keys(props.clients);
      this.logger = props.loggerFactory.getLogger(this);
    } else {
      validateTtlSeconds(props.defaultTtlSeconds);
      validateSomeCredentialsProvided(props.credentialProviders);

      const configuration: Configuration =
        props.configuration ?? getDefaultCacheClientConfiguration();

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
  }

  /**
   * Type guard to check if props are from pre-instantiated clients.
   */
  private isPropsFromClients(
    props: MultiRegionCacheWriterClientProps
  ): props is MultiRegionCacheWriterClientPropsFromClients {
    return 'clients' in props;
  }

  /**
   * Creates a MultiRegionCacheWriterClient from pre-instantiated cache clients.
   * @param props - The properties to create the MultiRegionCacheWriterClient.
   * @returns The MultiRegionCacheWriterClient.
   */
  public static fromClients(
    props: MultiRegionCacheWriterClientPropsFromClients
  ): MultiRegionCacheWriterClient {
    return new MultiRegionCacheWriterClient(props);
  }

  /**
   * Creates a MultiRegionCacheWriterClient from a configuration.
   * @param props - The properties to create the MultiRegionCacheWriterClient.
   * @returns The MultiRegionCacheWriterClient.
   */
  public static fromConfiguration(
    props: MultiRegionCacheWriterClientPropsFromConfiguration
  ): MultiRegionCacheWriterClient {
    return new MultiRegionCacheWriterClient(props);
  }

  /**
   * Executes a multi-region cache operation.
   *
   * @typeParam R - The type of the response from the cache operation.
   * @typeParam S - The type of the response when the operation is successful.
   * @typeParam E - The type of the response when the operation is not successful.
   * @param cacheOperationFn - The function that performs the cache operation.
   * @param isSuccessFn - The function that determines if the response is successful.
   * @param successResponseFn - The function that creates the successful response.
   * @param errorResponseFn - The function that creates the error response.
   * @returns The successful response or the error response.
   */
  private async executeMultiRegionOperation<R, S, E>({
    cacheOperationFn,
    isSuccessFn,
    successResponseFn,
    errorResponseFn,
  }: {
    cacheOperationFn: (client: ICacheClient) => Promise<R>;
    isSuccessFn: (response: R) => boolean;
    successResponseFn: (successes: Record<string, R>) => S;
    errorResponseFn: (
      successes: Record<string, R>,
      errors: Record<string, R>
    ) => E;
  }): Promise<S | E> {
    const responses = await Promise.all(
      this.regions.map(region => cacheOperationFn(this.clients[region]))
    );

    const successes: Record<string, R> = {};
    const errors: Record<string, R> = {};

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

  public async dictionarySetField(
    cacheName: string,
    dictionaryName: string,
    field: string | Uint8Array,
    value: string | Uint8Array,
    options?: DictionarySetFieldOptions
  ): Promise<MultiRegionCacheDictionarySetField.Response> {
    return await this.executeMultiRegionOperation({
      cacheOperationFn: client =>
        client.dictionarySetField(
          cacheName,
          dictionaryName,
          field,
          value,
          options
        ),
      isSuccessFn: response =>
        response.type === RegionalCacheDictionarySetFieldResponse.Success,
      successResponseFn: successes =>
        new MultiRegionCacheDictionarySetField.Success(
          successes as Record<string, RegionalCacheDictionarySetField.Success>
        ),
      errorResponseFn: (successes, errors) =>
        new MultiRegionCacheDictionarySetField.Error(
          successes as Record<string, RegionalCacheDictionarySetField.Success>,
          errors as Record<string, RegionalCacheDictionarySetField.Error>
        ),
    });
  }

  public async sortedSetPutElements(
    cacheName: string,
    sortedSetName: string,
    elements:
      | Map<string | Uint8Array, number>
      | Record<string, number>
      | Array<[string, number]>,
    options?: SortedSetPutElementsOptions
  ): Promise<MultiRegionCacheSortedSetPutElements.Response> {
    return await this.executeMultiRegionOperation({
      cacheOperationFn: client =>
        client.sortedSetPutElements(
          cacheName,
          sortedSetName,
          elements,
          options
        ),
      isSuccessFn: response =>
        response.type === RegionalCacheSortedSetPutElementsResponse.Success,
      successResponseFn: successes =>
        new MultiRegionCacheSortedSetPutElements.Success(
          successes as Record<string, RegionalCacheSortedSetPutElements.Success>
        ),
      errorResponseFn: (successes, errors) =>
        new MultiRegionCacheSortedSetPutElements.Error(
          successes as Record<
            string,
            RegionalCacheSortedSetPutElements.Success
          >,
          errors as Record<string, RegionalCacheSortedSetPutElements.Error>
        ),
    });
  }

  /**
   * Closes all the enclosed cache clients.
   */
  public close(): void {
    for (const client of Object.values(this.clients)) {
      client.close();
    }
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
