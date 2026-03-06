/**
 * Wordbook Bob Plugin - Entry Point
 * 单词本插件 - Bob 翻译插件
 * 
 * Supports: 有道词典, 欧路词典, 扇贝单词, Momo背单词
 */

/// <reference path="./types/bob.d.ts" />

import { buildResult, buildError, buildValidationError } from './utils';
import ProviderRegistry from './registry';
import type { BobQuery, BobTranslateCompletion, BobValidateCompletion } from './types/bob';

// ============================================================
// Bob Plugin Interface Implementation
// ============================================================

/**
 * Get supported languages
 */
function supportLanguages(): string[] {
  return ['zh-Hans', 'en'];
}

/**
 * Plugin validation
 */
function pluginValidate(completion: BobValidateCompletion): void {
  const selectedDict = $option.dict_type;
  const authorization = $option.authorization;
  
  if (!authorization) {
    completion(buildValidationError('未设置认证信息。'));
    return;
  }
  
  const provider = ProviderRegistry.get(selectedDict);
  if (!provider) {
    completion(buildValidationError('未知的词典类型。'));
    return;
  }
  
  const options = {
    wordbook_id: $option.wordbook_id,
  };
  
  provider.validate(authorization, options, completion);
}

/**
 * Translate/Add word
 */
function translate(query: BobQuery, completion: BobTranslateCompletion): void {
  const text = query.text;
  const fromLanguage = query.detectFrom;
  const selectedDict = $option.dict_type;
  const wordOnly = $option.word_only;
  const authorization = $option.authorization;
  
  // Check if save is needed
  const needSave = wordOnly === '0' || text.search(' ') < 1;
  if (fromLanguage !== 'en' || !needSave) {
    completion({ result: buildResult('中文、非英语单词无需添加单词本') });
    return;
  }
  
  // Check authorization
  if (!authorization) {
    completion({ error: buildError('「认证信息」缺失') });
    return;
  }
  
  // Get provider and add word
  const provider = ProviderRegistry.get(selectedDict);
  if (!provider) {
    completion({ error: buildError('未知的词典类型') });
    return;
  }
  
  const options = {
    wordbook_id: $option.wordbook_id,
  };
  
  provider.addWord(authorization, text, options, completion);
}

// ============================================================
// Export functions to global scope for Bob plugin runtime
// ============================================================

// Attach functions to globalThis for Bob plugin compatibility
Object.assign(globalThis, {
  supportLanguages,
  pluginValidate,
  translate,
});

export { supportLanguages, pluginValidate, translate };
