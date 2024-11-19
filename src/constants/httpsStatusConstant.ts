type HttpStatus = {
  code: number;
  errorCode: string;
  message: string;
};

const httpStatusCodes: Record<string, HttpStatus> = {
  CONTINUE: {
    code: 200,
    errorCode: "CONTINUE",
    message: "Continue",
  },
  SWITCHING_PROTOCOLS: {
    code: 101,
    errorCode: "SWITCHING_PROTOCOLS",
    message: "Switching Protocol",
  },
  PROCESSING: {
    code: 102,
    errorCode: "PROCESSING",
    message: "Processing",
  },
  OK: {
    code: 200,
    errorCode: "OK",
    message: "Ok",
  },
  CREATED: {
    code: 201,
    errorCode: "CREATED",
    message: "Created",
  },
  ACCEPTED: {
    code: 202,
    errorCode: "ACCEPTED",
    message: "Accepted",
  },
  NON_AUTHORITATIVE_INFORMATION: {
    code: 203,
    errorCode: "NON_AUTHORITATIVE_INFORMATION",
    message: "Non Authoritative Information",
  },
  NO_CONTENT: {
    code: 204,
    errorCode: "NO_CONTENT",
    message: "No Content",
  },
  RESET_CONTENT: {
    code: 205,
    errorCode: "RESET_CONTENT",
    message: "Reset Content",
  },
  PARTIAL_CONTENT: {
    code: 206,
    errorCode: "PARTIAL_CONTENT",
    message: "Partial Content",
  },
  AMBIGUOUS: {
    code: 300,
    errorCode: "AMBIGUOUS",
    message: "Ambiguous",
  },
  MOVED_PERMANENTLY: {
    code: 301,
    errorCode: "MOVED_PERMANENTLY",
    message: "Moved Permanently",
  },
  FOUND: {
    code: 302,
    errorCode: "FOUND",
    message: "Found",
  },
  SEE_OTHER: {
    code: 303,
    errorCode: "SEE_OTHER",
    message: "See Other",
  },
  NOT_MODIFIED: {
    code: 304,
    errorCode: "NOT_MODIFIED",
    message: "Not Modified",
  },
  TEMPORARY_REDIRECT: {
    code: 307,
    errorCode: "TEMPORARY_REDIRECT",
    message: "Temporary Redirect",
  },
  PERMANENT_REDIRECT: {
    code: 308,
    errorCode: "PERMANENT_REDIRECT",
    message: "Permanent Redirect",
  },
  BAD_REQUEST: {
    code: 400,
    errorCode: "BAD_REQUEST",
    message: "Bad Request",
  },
  UNAUTHORIZED: {
    code: 401,
    errorCode: "UNAUTHORIZED",
    message: "Unauthorized",
  },
  PAYMENT_REQUIRED: {
    code: 402,
    errorCode: "PAYMENT_REQUIRED",
    message: "Payment Required",
  },
  FORBIDDEN: {
    code: 403,
    errorCode: "FORBIDDEN",
    message: "Forbidden",
  },
  NOT_FOUND: {
    code: 404,
    errorCode: "NOT_FOUND",
    message: "Not Found",
  },
  METHOD_NOT_ALLOWED: {
    code: 405,
    errorCode: "METHOD_NOT_ALLOWED",
    message: "Method Not Allowed",
  },
  NOT_ACCEPTABLE: {
    code: 406,
    errorCode: "NOT_ACCEPTABLE",
    message: "Not Acceptable",
  },
  PROXY_AUTHENTICATION_REQUIRED: {
    code: 407,
    errorCode: "PROXY_AUTHENTICATION_REQUIRED",
    message: "Proxy Authentication Required",
  },
  REQUEST_TIMEOUT: {
    code: 408,
    errorCode: "REQUEST_TIMEOUT",
    message: "Request Timeout",
  },
  CONFLICT: {
    code: 409,
    errorCode: "CONFLICT",
    message: "Conflict",
  },
  GONE: {
    code: 410,
    errorCode: "GONE",
    message: "Gone",
  },
  LENGTH_REQUIRED: {
    code: 411,
    errorCode: "LENGTH_REQUIRED",
    message: "Length Required",
  },
  PRECONDITION_FAILED: {
    code: 412,
    errorCode: "PRECONDITION_FAILED",
    message: "Precondition Failed",
  },
  PAYLOAD_TOO_LARGE: {
    code: 413,
    errorCode: "PAYLOAD_TOO_LARGE",
    message: "Payload Too Large",
  },
  URI_TOO_LONG: {
    code: 414,
    errorCode: "URI_TOO_LONG",
    message: "URI Too Long",
  },
  UNSUPPORTED_MEDIA_TYPE: {
    code: 415,
    errorCode: "UNSUPPORTED_MEDIA_TYPE",
    message: "Unsupported Media Type",
  },
  REQUESTED_RANGE_NOT_SATISFIABLE: {
    code: 416,
    errorCode: "REQUESTED_RANGE_NOT_SATISFIABLE",
    message: "Requested Range Not Satisfiable",
  },
  EXPECTATION_FAILED: {
    code: 417,
    errorCode: "EXPECTATION_FAILED",
    message: "Expectation Failed",
  },
  I_AM_A_TEAPOT: {
    code: 418,
    errorCode: "I_AM_A_TEAPOT",
    message: "I am a teapot",
  },
  MISDIRECTED: {
    code: 421,
    errorCode: "MISDIRECTED",
    message: "Misdirected",
  },
  UNPROCESSABLE_ENTITY: {
    code: 422,
    errorCode: "UNPROCESSABLE_ENTITY",
    message: "Unprocessable Entity",
  },
  FAILED_DEPENDENCY: {
    code: 424,
    errorCode: "FAILED_DEPENDENCY",
    message: "Failed Dependency",
  },
  TOO_MANY_REQUESTS: {
    code: 429,
    errorCode: "TOO_MANY_REQUESTS",
    message: "Too Many Requests",
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    errorCode: "INTERNAL_SERVER_ERROR",
    message: "Internal Server Error",
  },
  NOT_IMPLEMENTED: {
    code: 501,
    errorCode: "NOT_IMPLEMENTED",
    message: "Not Implemented",
  },
  BAD_GATEWAY: {
    code: 502,
    errorCode: "BAD_GATEWAY",
    message: "Bad Gateway",
  },
  SERVICE_UNAVAILABLE: {
    code: 503,
    errorCode: "SERVICE_UNAVAILABLE",
    message: "Service Unavailable",
  },
  GATEWAY_TIMEOUT: {
    code: 504,
    errorCode: "GATEWAY_TIMEOUT",
    message: "Gateway Timeout",
  },
  HTTP_VERSION_NOT_SUPPORTED: {
    code: 505,
    errorCode: "HTTP_VERSION_NOT_SUPPORTED",
    message: "HTTP Version Not Supported",
  },
};

export default httpStatusCodes;
