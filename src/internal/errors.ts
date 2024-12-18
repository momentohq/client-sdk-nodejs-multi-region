import {UnknownError} from '@gomomento/sdk';

export function mapErrorToUnknownError(error: unknown): UnknownError {
  const message = error instanceof Error ? error.message : String(error);
  return new UnknownError(message);
}
