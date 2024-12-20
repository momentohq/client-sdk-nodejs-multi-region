import {v4} from 'uuid';
import {SetupIntegrationTest} from './integration-setup';
import {MultiRegionCacheSortedSetPutElementsResponse} from '../src';
import {CacheSortedSetFetchResponse} from '@gomomento/sdk';

const {multiRegionClient, regionalClients, cacheName} = SetupIntegrationTest();

describe('sorted set put elements', () => {
  it('happy path put elements', async () => {
    const sortedSetName = v4();

    const items = {element1: 1, element2: 2};
    const multiRegionSetResponse = await multiRegionClient.sortedSetPutElements(
      cacheName,
      sortedSetName,
      items
    );

    expect(multiRegionSetResponse.type).toEqual(
      MultiRegionCacheSortedSetPutElementsResponse.Success
    );

    const expectedItems = Object.entries(items).map(([value, score]) => ({
      value,
      score,
    }));
    for (const [_, client] of Object.entries(regionalClients)) {
      const getResponse = await client.sortedSetFetchByRank(
        cacheName,
        sortedSetName
      );
      expect(getResponse.type).toEqual(CacheSortedSetFetchResponse.Hit);
      expect(getResponse.value()).toEqual(expectedItems);
    }
  });
  it("has an error when writing to a cache that doesn't exist", async () => {
    const sortedSetName = v4();
    const items = {element1: 1, element2: 2};
    const nonExistentCacheName = v4();

    const multiRegionSetResponse = await multiRegionClient.sortedSetPutElements(
      nonExistentCacheName,
      sortedSetName,
      items
    );

    expect(multiRegionSetResponse.type).toEqual(
      MultiRegionCacheSortedSetPutElementsResponse.Error
    );
  });
});
