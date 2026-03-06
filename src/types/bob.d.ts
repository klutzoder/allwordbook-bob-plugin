/**
 * Bob Plugin Runtime Type Declarations
 * These globals are provided by Bob's plugin runtime environment
 */

// HTTP Response interface
interface BobHttpResponse {
  data: unknown;
  response: {
    statusCode: number;
    headers?: Record<string, string>;
  };
  error?: {
    message: string;
    code?: string;
  };
}

// HTTP Request options
interface BobHttpGetOptions {
  url: string;
  header?: Record<string, string | number>;
  handler: (response: BobHttpResponse) => void;
}

interface BobHttpPostOptions {
  url: string;
  header?: Record<string, string | number>;
  body?: unknown;
  handler: (response: BobHttpResponse) => void;
}

// Bob HTTP client global
interface BobHttp {
  get(options: BobHttpGetOptions): void;
  post(options: BobHttpPostOptions): void;
}

// Bob Log global
interface BobLog {
  info(message: string): void;
  error(message: string): void;
  warn(message: string): void;
}

// Bob Plugin Options (configured in info.json)
interface BobPluginOptions {
  dict_type: string;
  authorization: string;
  word_only: string;
  wordbook_id: string;
}

// Bob Query object for translate function
interface BobQuery {
  text: string;
  detectFrom: string;
  detectTo: string;
}

// Bob Translation Result
interface BobTranslationResult {
  from: string;
  to: string;
  toParagraphs: string[];
  fromParagraphs: string[];
}

// Bob Error object
interface BobError {
  type: string;
  message: string;
  addtion?: string;
  troubleshootingLink?: string;
}

// Bob Validation Result
interface BobValidationResult {
  result: boolean;
  error?: {
    type: string;
    message: string;
    troubleshootingLink?: string;
  };
}

// Bob Completion callback types
type BobTranslateCompletion = (result: { result?: BobTranslationResult; error?: BobError }) => void;
type BobValidateCompletion = (result: BobValidationResult) => void;

// Declare global variables provided by Bob runtime
declare const $http: BobHttp;
declare const $log: BobLog;
declare const $option: BobPluginOptions;

// Export types for use in other modules
export type {
  BobHttpResponse,
  BobHttpGetOptions,
  BobHttpPostOptions,
  BobHttp,
  BobLog,
  BobPluginOptions,
  BobQuery,
  BobTranslationResult,
  BobError,
  BobValidationResult,
  BobTranslateCompletion,
  BobValidateCompletion,
};
