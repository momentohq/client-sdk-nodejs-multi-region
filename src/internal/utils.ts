import {ICacheClient, InvalidArgumentError} from '@gomomento/sdk';

// Currently accepting ttl in seconds, but if someone requests support for millis,
// the validator will need to check for Number.isSafeInteger(ttl * 1000).
export function validateTtlSeconds(ttl: number) {
  if (ttl < 0 || !Number.isSafeInteger(ttl)) {
    throw new InvalidArgumentError(
      `ttl must be a positive integer, received ${ttl}`
    );
  }
}

export function validateSomeCredentialsProvided(
  credentialProviders: Record<string, unknown>
) {
  if (Object.keys(credentialProviders).length === 0) {
    throw new InvalidArgumentError(
      'At least one credential provider must be provided'
    );
  }
}

export function validateSomeClientsProvided(
  clients: Record<string, ICacheClient>
): void {
  if (Object.keys(clients).length === 0) {
    throw new InvalidArgumentError('At least one client must be provided');
  }
}
