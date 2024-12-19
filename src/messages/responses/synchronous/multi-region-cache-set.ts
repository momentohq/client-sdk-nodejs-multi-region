import {BaseResponseError, BaseResponseSuccess} from '../response-base';
import {MultiRegionCacheSetResponse} from '../enums';
import {CacheSet as RegionalCacheSet} from '@gomomento/sdk';

interface IResponse {
  readonly type: MultiRegionCacheSetResponse;
}

/**
 * Indicates a successful multi-region cache set request.
 */
export class Success
  extends BaseResponseSuccess<RegionalCacheSet.Success>
  implements IResponse
{
  readonly type: MultiRegionCacheSetResponse.Success =
    MultiRegionCacheSetResponse.Success;
}

/**
 * Indicates that an error occurred during the multi-region cache set request.
 *
 * This response object includes the following fields that you can use to inspect
 * the successes vs failures:
 *
 * - `successes()` - a map of successful cache set requests by region
 * - `errors()` - a map of errors that occurred during the cache set requests by region
 */
export class Error
  extends BaseResponseError<RegionalCacheSet.Success, RegionalCacheSet.Error>
  implements IResponse
{
  readonly type: MultiRegionCacheSetResponse.Error =
    MultiRegionCacheSetResponse.Error;
}

export type Response = Success | Error;
