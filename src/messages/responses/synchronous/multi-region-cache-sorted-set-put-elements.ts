import {BaseResponseError, BaseResponseSuccess} from '../response-base';
import {MultiRegionCacheSortedSetPutElementsResponse} from '../enums';
import {CacheSortedSetPutElements as RegionalCacheSortedSetPutElements} from '@gomomento/sdk';

interface IResponse {
  readonly type: MultiRegionCacheSortedSetPutElementsResponse;
}

/**
 * Indicates a successful multi-region cache sorted set put elements request.
 */

export class Success
  extends BaseResponseSuccess<RegionalCacheSortedSetPutElements.Success>
  implements IResponse
{
  readonly type: MultiRegionCacheSortedSetPutElementsResponse.Success =
    MultiRegionCacheSortedSetPutElementsResponse.Success;
}

/**
 * Indicates that an error occurred during the multi-region cache sorted set put elements request.
 *
 * This response object includes the following fields that you can use to inspect
 * the successes vs failures:
 *
 * - `successes()` - a map of successful cache set requests by region
 * - `errors()` - a map of errors that occurred during the cache set requests by region
 */
export class Error
  extends BaseResponseError<
    RegionalCacheSortedSetPutElements.Success,
    RegionalCacheSortedSetPutElements.Error
  >
  implements IResponse
{
  readonly type: MultiRegionCacheSortedSetPutElementsResponse.Error =
    MultiRegionCacheSortedSetPutElementsResponse.Error;
}

export type Response = Success | Error;
