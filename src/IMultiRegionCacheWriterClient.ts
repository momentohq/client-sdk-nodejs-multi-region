import {SetOptions, SortedSetPutElementsOptions} from '@gomomento/sdk';
import {
  MultiRegionCacheSet,
  MultiRegionCacheSortedSetPutElements,
} from './messages/responses/synchronous';

export interface IMultiRegionCacheWriterClient {
  set(
    cacheName: string,
    key: string | Uint8Array,
    value: string | Uint8Array,
    options?: SetOptions
  ): Promise<MultiRegionCacheSet.Response>;

  sortedSetPutElements(
    cacheName: string,
    sortedSetName: string,
    elements:
      | Map<string | Uint8Array, number>
      | Record<string, number>
      | Array<[string, number]>,
    options?: SortedSetPutElementsOptions
  ): Promise<MultiRegionCacheSortedSetPutElements.Response>;
}
