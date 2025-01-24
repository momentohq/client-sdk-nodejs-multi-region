import {
  CredentialProvider,
  Configuration,
  ICacheClient,
  MomentoLoggerFactory,
} from '@gomomento/sdk';

/**
 * Properties for creating a MultiRegionCacheWriterClient from a shared
 * configuration.
 */
export interface MultiRegionCacheWriterClientPropsFromConfiguration {
  /**
   * Configuration settings for the cache clients in each region.
   */
  configuration?: Configuration;
  /**
   * Controls how the client will get authentication information for connecting to the Momento service.
   * Maps from a regional identifier to a credential provider.
   */
  credentialProviders: Record<string, CredentialProvider>;
  /**
   * the default time to live of object inside of cache, in seconds
   */
  defaultTtlSeconds: number;
}

/**
 * Properties for creating a MultiRegionCacheWriterClient from a set of
 * pre-configured cache clients.
 */
export interface MultiRegionCacheWriterClientPropsFromClients {
  /**
   * Configuration settings for the cache clients in each region.
   */
  clients: Record<string, ICacheClient>;

  /**
   * The logger factory to use for logging.
   */
  loggerFactory: MomentoLoggerFactory;
}

export type MultiRegionCacheWriterClientProps =
  | MultiRegionCacheWriterClientPropsFromConfiguration
  | MultiRegionCacheWriterClientPropsFromClients;
