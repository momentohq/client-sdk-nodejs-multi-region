import {BaseResponseError, BaseResponseSuccess} from '../response-base';
import {MultiRegionCacheSetResponse} from '../enums';
import {CacheSet as RegionalCacheSet} from '@gomomento/sdk';

interface IResponse {
  readonly type: MultiRegionCacheSetResponse;
}

/**
 * Indicates a Successful cache set request.
 */
export class Success
  extends BaseResponseSuccess<RegionalCacheSet.Success>
  implements IResponse
{
  readonly type: MultiRegionCacheSetResponse.Success =
    MultiRegionCacheSetResponse.Success;
}

/**
 * Indicates that an error occurred during the cache set request.
 *
 * This response object includes the following fields that you can use to determine
 * how you would like to handle the error:
 *
 * - `errorCode()` - a unique Momento error code indicating the type of error that occurred.
 * - `message()` - a human-readable description of the error
 * - `innerException()` - the original error that caused the failure; can be re-thrown.
 */
export class Error
  extends BaseResponseError<RegionalCacheSet.Success, RegionalCacheSet.Error>
  implements IResponse
{
  readonly type: MultiRegionCacheSetResponse.Error =
    MultiRegionCacheSetResponse.Error;
}

export type Response = Success | Error;
