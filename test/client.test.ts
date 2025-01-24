import {
  Configurations,
  InvalidArgumentError,
  MultiRegionCacheWriterClient,
  NoopMomentoLoggerFactory,
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

  it('should throw an exception when no clients are provided', () => {
    expect(() => {
      MultiRegionCacheWriterClient.fromClients({
        clients: {},
        loggerFactory: new NoopMomentoLoggerFactory(),
      });
    }).toThrow(InvalidArgumentError);
  });
});
