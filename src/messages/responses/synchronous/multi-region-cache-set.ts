import {BaseResponseError, ResponseBase} from '../response-base';
import {MultiRegionCacheSetResponse} from '../enums';
import {CacheSet as RegionalCacheSet, SdkError} from '@gomomento/sdk';

interface IResponse {
  readonly type: MultiRegionCacheSetResponse;
}

/**
 * Indicates a Successful cache set request.
 */
export class Success extends ResponseBase implements IResponse {
  readonly type: MultiRegionCacheSetResponse.Success =
    MultiRegionCacheSetResponse.Success;
  private readonly responses: Record<string, RegionalCacheSet.Response>;

  constructor(responses: Record<string, RegionalCacheSet.Response>) {
    super();
    this.responses = responses;
  }

  /**
   * Get the responses from each region.
   */
  public results(): Record<string, RegionalCacheSet.Response> {
    return this.responses;
  }
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
export class Error extends BaseResponseError implements IResponse {
  constructor(_innerException: SdkError) {
    super(_innerException);
  }

  readonly type: MultiRegionCacheSetResponse.Error =
    MultiRegionCacheSetResponse.Error;
}

export type Response = Success | Error;
