import {MomentoErrorCode, SdkError} from '@gomomento/sdk';

export abstract class ResponseBase {
  public toString(): string {
    return this.constructor.name;
  }
}

export abstract class BaseResponseError extends ResponseBase {
  protected readonly _innerException: SdkError;

  protected constructor(innerException: SdkError) {
    super();
    this._innerException = innerException;
  }

  public message(): string {
    return this._innerException.wrappedErrorMessage();
  }

  public innerException(): SdkError {
    return this._innerException;
  }

  public errorCode(): MomentoErrorCode {
    return this._innerException.errorCode();
  }

  public override toString(): string {
    return this.message();
  }
}
