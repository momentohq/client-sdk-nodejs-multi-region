import {SetOptions, SortedSetPutElementsOptions} from '@gomomento/sdk';
import {
  MultiRegionCacheSet,
  MultiRegionCacheSortedSetPutElements,
} from './messages/responses/synchronous';

/**
 * A client for writing to the same cache in multiple regions.
 */
export interface IMultiRegionCacheWriterClient {
  /**
   * Associates the given key with the given value. If a value for the key is
   * already present it is replaced with the new value.
   *
   * @param {string} cacheName - The cache to store the value in.
   * @param {string | Uint8Array} key - The key to set.
   * @param {string | Uint8Array} value - The value to be stored.
   * @param {SetOptions} [options]
   * @param {number} [options.ttl] - The time to live for the item in the cache.
   * Uses the client's default TTL if this is not supplied.
   * @param {boolean} [options.compress=false] - Whether to compress the value. Defaults to false.
   * @returns {Promise<MultiRegionCacheSet.Response>} -
   * {@link MultiRegionCacheSet.Success} on success.
   * {@link MultiRegionCacheSet.Error} on any underlying failure.
   */
  set(
    cacheName: string,
    key: string | Uint8Array,
    value: string | Uint8Array,
    options?: SetOptions
  ): Promise<MultiRegionCacheSet.Response>;

  /**
   * Adds elements to the given sorted set. For any values that already exist, it
   * the score is updated. Creates the sorted set if it does not exist.
   *
   * @param {string} cacheName - The cache containing the sorted set.
   * @param {string} sortedSetName - The sorted set to add to.
   * @param {Map<string | Uint8Array, number>| Record<string, number>} elements - The value->score pairs to add to the sorted set.
   * @param {SortedSetPutElementOptions} options
   * @param {CollectionTtl} [options.ttl] - How the TTL should be managed.
   * Refreshes the sorted set's TTL using the client's default if this is not
   * supplied.
   * @returns {Promise<MultiRegionCacheSortedSetPutElements.Response>} -
   * {@link MultiRegionCacheSortedSetPutElements.Success} on success.
   * {@link MultiRegionCacheSortedSetPutElements.Error} on any underlying failure.
   */
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
