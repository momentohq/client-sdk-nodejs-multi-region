import {CredentialProvider, Configuration} from '@gomomento/sdk';

export interface MultiRegionCacheWriterClientProps {
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
  // TODO global rate limiter
}
