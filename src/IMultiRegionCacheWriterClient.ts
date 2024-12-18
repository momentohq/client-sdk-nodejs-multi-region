import {SetOptions} from '@gomomento/sdk';
import {MultiRegionCacheSet} from './messages/responses/synchronous';

export interface IMultiRegionCacheWriterClient {
  set(
    cacheName: string,
    key: string | Uint8Array,
    value: string | Uint8Array,
    options?: SetOptions
  ): Promise<MultiRegionCacheSet.Response>;
}
