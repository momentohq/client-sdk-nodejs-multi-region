import {v4} from 'uuid';
import {SetupIntegrationTest} from './integration-setup';
import {MultiRegionCacheDictionarySetFieldResponse} from '../src';
import {CacheSortedSetFetchResponse} from '@gomomento/sdk';

const {multiRegionClient, regionalClients, cacheName} = SetupIntegrationTest();

describe('dictionary set field', () => {
  it('happy path set field', async () => {
    const dictionaryName = v4();

    const multiRegionSetFieldResponse =
      await multiRegionClient.dictionarySetField(
        cacheName,
        dictionaryName,
        'field1',
        '1'
      );

    expect(multiRegionSetFieldResponse.type).toEqual(
      MultiRegionCacheDictionarySetFieldResponse.Success
    );

    for (const [_, client] of Object.entries(regionalClients)) {
      const getResponse = await client.dictionaryFetch(
        cacheName,
        dictionaryName
      );
      expect(getResponse.type).toEqual(CacheSortedSetFetchResponse.Hit);
      expect(getResponse.value()).toEqual({field1: '1'});
    }
  });
  it("has an error when writing to a cache that doesn't exist", async () => {
    const dictionaryName = v4();
    const nonExistentCacheName = v4();

    const multiRegionSetResponse = await multiRegionClient.dictionarySetField(
      nonExistentCacheName,
      dictionaryName,
      'field1',
      '1'
    );

    expect(multiRegionSetResponse.type).toEqual(
      MultiRegionCacheDictionarySetFieldResponse.Error
    );
  });
});
