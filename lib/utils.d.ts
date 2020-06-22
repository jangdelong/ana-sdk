export declare enum HttpStatus {
    Unknown = "unknown",
    Skipped = "skipped",
    Success = "success",
    RateLimit = "rate_limit",
    Invalid = "invalid",
    Failed = "failed"
}
export declare function fromHttpCode(code: number): HttpStatus;
