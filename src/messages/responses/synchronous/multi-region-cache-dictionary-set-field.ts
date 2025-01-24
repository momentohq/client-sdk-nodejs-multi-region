import {BaseResponseError, BaseResponseSuccess} from '../response-base';
import {MultiRegionCacheDictionarySetFieldResponse} from '../enums';
import {CacheDictionarySetField as RegionalCacheDictionarySetField} from '@gomomento/sdk';

interface IResponse {
  readonly type: MultiRegionCacheDictionarySetFieldResponse;
}

/**
 * Indicates a successful multi-region cache dictionary set field request.
 */

export class Success
  extends BaseResponseSuccess<RegionalCacheDictionarySetField.Success>
  implements IResponse
{
  readonly type: MultiRegionCacheDictionarySetFieldResponse.Success =
    MultiRegionCacheDictionarySetFieldResponse.Success;
}

/**
 * Indicates that an error occurred during the multi-region cache dictionary set field request.
 *
 * This response object includes the following fields that you can use to inspect
 * the successes vs failures:
 *
 * - `successes()` - a map of successful cache set requests by region
 * - `errors()` - a map of errors that occurred during the cache set requests by region
 */
export class Error
  extends BaseResponseError<
    RegionalCacheDictionarySetField.Success,
    RegionalCacheDictionarySetField.Error
  >
  implements IResponse
{
  readonly type: MultiRegionCacheDictionarySetFieldResponse.Error =
    MultiRegionCacheDictionarySetFieldResponse.Error;
}

export type Response = Success | Error;
