import {
  Configurations,
  InvalidArgumentError,
  MultiRegionCacheWriterClient,
} from '../src';

describe('client-setup', () => {
  it('should throw an exception when no regions are provided', () => {
    expect(() => {
      MultiRegionCacheWriterClient.fromConfiguration({
        credentialProviders: {},
        configuration: Configurations.Laptop.latest(),
        defaultTtlSeconds: 60,
      });
    }).toThrow(InvalidArgumentError);
  });
});
