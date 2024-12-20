import {
  Configurations,
  InvalidArgumentError,
  MultiRegionCacheWriterClient,
} from '../src';

describe('client-setup', () => {
  it('should throw an exception when no regions are provided', () => {
    expect(() => {
      new MultiRegionCacheWriterClient({
        credentialProviders: {},
        configuration: Configurations.Laptop.latest(),
        defaultTtlSeconds: 60,
      });
    }).toThrow(InvalidArgumentError);
  });
});
