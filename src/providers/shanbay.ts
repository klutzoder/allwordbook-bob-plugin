/**
 * Shanbay Dictionary Provider
 * 扇贝单词 Provider
 */

/// <reference path="../types/bob.d.ts" />

import { USER_AGENT } from '../constants';
import { buildResult, buildError } from '../utils';
import type { Provider, ProviderOptions } from '../types/provider';
import type { BobHttpResponse, BobTranslateCompletion, BobValidateCompletion } from '../types/bob';

const ShanbayProvider: Provider = {
  name: '扇贝单词',
  
  /**
   * Add word to Shanbay
   */
  addWord(
    authorization: string,
    word: string,
    _options: ProviderOptions,
    completion: BobTranslateCompletion
  ): void {
    const apiUrl = 'https://apiv3.shanbay.com/wordscollection/words_bulk_upload';
    
    $http.post({
      url: apiUrl,
      header: {
        'Cookie': 'auth_token=' + authorization,
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT,
      },
      body: {
        business_id: 6,
        words: [word],
      },
      handler(res: BobHttpResponse) {
        if (res.response.statusCode === 200) {
          completion({ result: buildResult('添加单词成功') });
        } else {
          completion({ error: buildError('扇贝词典 auth_token 错误或过期，请重新填写。') });
          $log.info('接口返回值 data : ' + JSON.stringify(res.data));
        }
      },
    });
  },
  
  /**
   * Validate Shanbay configuration
   */
  validate(
    _authorization: string,
    _options: ProviderOptions,
    completion: BobValidateCompletion
  ): void {
    // Shanbay has no validation logic, return success directly
    completion({ result: true });
  },
};

export default ShanbayProvider;
