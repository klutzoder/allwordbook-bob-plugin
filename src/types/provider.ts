/**
 * Provider Interface
 * Defines the contract for all dictionary providers
 */

import type { BobTranslateCompletion, BobValidateCompletion } from './bob';

/**
 * Options passed to provider methods
 */
export interface ProviderOptions {
  wordbook_id?: string;
}

/**
 * Base interface for all dictionary providers
 */
export interface Provider {
  /** Display name of the provider */
  name: string;
  
  /**
   * Add a word to the dictionary wordbook
   * @param authorization - Authentication token/cookie
   * @param word - The word to add
   * @param options - Additional options (e.g., wordbook_id)
   * @param completion - Callback function
   */
  addWord(
    authorization: string,
    word: string,
    options: ProviderOptions,
    completion: BobTranslateCompletion
  ): void;
  
  /**
   * Validate the provider configuration
   * @param authorization - Authentication token/cookie
   * @param options - Additional options (e.g., wordbook_id)
   * @param completion - Callback function
   */
  validate(
    authorization: string,
    options: ProviderOptions,
    completion: BobValidateCompletion
  ): void;
}
