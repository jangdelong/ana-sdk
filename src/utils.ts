export enum HttpStatus {
  Unknown = 'unknown',
  Skipped = 'skipped',
  Success = 'success',
  RateLimit = 'rate_limit',
  Invalid = 'invalid',
  Failed = 'failed',
}

export function fromHttpCode (code: number): HttpStatus {
  if (code >= 200 && code < 300) {
    return HttpStatus.Success
  }

  if (code === 429) {
    return HttpStatus.RateLimit
  }

  if (code >= 400 && code < 500) {
    return HttpStatus.Invalid
  }

  if (code >= 500) {
    return HttpStatus.Failed
  }

  return HttpStatus.Unknown
}

