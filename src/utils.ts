/**
 * Utility Functions
 * 工具函数
 */

import { TROUBLESHOOTING_LINK } from './constants';
import type { BobTranslationResult, BobError, BobValidationResult } from './types/bob';

/**
 * Build a successful translation result
 */
export function buildResult(message: string): BobTranslationResult {
  return {
    from: 'en',
    to: 'zh-Hans',
    toParagraphs: [message],
    fromParagraphs: ['success add to word book'],
  };
}

/**
 * Build an error object
 */
export function buildError(message: string): BobError {
  return {
    type: 'param',
    message: message,
    addtion: '无',
  };
}

/**
 * Build a validation error result
 */
export function buildValidationError(message: string, link?: string): BobValidationResult {
  return {
    result: false,
    error: {
      type: 'secretKey',
      message: message,
      troubleshootingLink: link || TROUBLESHOOTING_LINK,
    },
  };
}
