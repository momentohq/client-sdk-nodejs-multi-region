import {v4} from 'uuid';
import {SetupIntegrationTest} from './integration-setup';
import {MultiRegionCacheSetResponse} from '../src';
import {CacheGetResponse} from '@gomomento/sdk';

const {multiRegionClient, regionalClients, cacheName} = SetupIntegrationTest();

describe('simple get and set', () => {
  it('happy path set get', async () => {
    const key = v4();
    const value = v4();

    const multiRegionSetResponse = await multiRegionClient.set(
      cacheName,
      key,
      value
    );

    expect(multiRegionSetResponse.type).toEqual(
      MultiRegionCacheSetResponse.Success
    );

    for (const [_, client] of Object.entries(regionalClients)) {
      const getResponse = await client.get(cacheName, key);
      expect(getResponse.type).toEqual(CacheGetResponse.Hit);
      expect(getResponse.value()).toEqual(value);
    }
  });
  it("has an error when writing to a cache that doesn't exist", async () => {
    const key = v4();
    const value = v4();
    const nonExistentCacheName = v4();

    const multiRegionSetResponse = await multiRegionClient.set(
      nonExistentCacheName,
      key,
      value
    );

    expect(multiRegionSetResponse.type).toEqual(
      MultiRegionCacheSetResponse.Error
    );
  });
});
