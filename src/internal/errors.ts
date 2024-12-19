import {SdkError, MomentoErrorCode} from '@gomomento/sdk';

export function mapErrorToAggregationError(error: unknown): AggregationError {
  const message = error instanceof Error ? error.message : String(error);
  return new AggregationError(message);
}

/**
 * Error raised when there is an error aggregating responses from multiple regions.
 */
export class AggregationError extends SdkError {
  override _errorCode: MomentoErrorCode = MomentoErrorCode.UNKNOWN_ERROR;
  override _messageWrapper =
    'Error aggregating responses from multiple regions';
}
