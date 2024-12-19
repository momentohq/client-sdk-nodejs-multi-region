export abstract class ResponseBase {
  public toString(): string {
    return this.constructor.name;
  }
}

/**
 * A response that includes successful responses only.
 */
export class BaseResponseSuccess<S> extends ResponseBase {
  private readonly responses: Record<string, S>;

  constructor(responses: Record<string, S>) {
    super();
    this.responses = responses;
  }

  /**
   * Get the responses from each region.
   */
  public results(): Record<string, S> {
    return this.responses;
  }

  public override toString(): string {
    return `${this.constructor.name}: responses = ${JSON.stringify(
      this.responses
    )}`;
  }
}

/**
 * A response that includes both successful and failed responses.
 */
export abstract class BaseResponseError<S, E> extends ResponseBase {
  protected readonly _successes: Record<string, S>;
  protected readonly _errors: Record<string, E>;

  constructor(successes: Record<string, S>, errors: Record<string, E>) {
    super();
    this._successes = successes;
    this._errors = errors;
  }

  public successes(): Record<string, S> {
    return this._successes;
  }

  public errors(): Record<string, E> {
    return this._errors;
  }

  public override toString(): string {
    return `${this.constructor.name}: successes = ${JSON.stringify(
      this._successes
    )}, errors = ${JSON.stringify(this._errors)}`;
  }
}
