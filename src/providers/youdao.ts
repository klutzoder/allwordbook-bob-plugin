/**
 * Youdao Dictionary Provider
 * 有道词典 Provider
 */

/// <reference path="../types/bob.d.ts" />

import { USER_AGENT } from '../constants';
import { buildResult, buildError } from '../utils';
import type { Provider, ProviderOptions } from '../types/provider';
import type { BobHttpResponse, BobTranslateCompletion, BobValidateCompletion } from '../types/bob';

const YoudaoProvider: Provider = {
  name: '有道词典',
  
  /**
   * Add word to Youdao Dictionary
   */
  addWord(
    authorization: string,
    word: string,
    _options: ProviderOptions,
    completion: BobTranslateCompletion
  ): void {
    const apiUrl = 'https://dict.youdao.com/wordbook/webapi/v2/ajax/add?lan=en&word=';
    
    $http.get({
      url: apiUrl + encodeURIComponent(word),
      header: {
        'Cookie': authorization,
        'Host': 'dict.youdao.com',
        'Upgrade-Insecure-Requests': 1,
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://dict.youdao.com',
        'User-Agent': USER_AGENT,
      },
      handler(res: BobHttpResponse) {
        const data = res.data as { code?: number } | null;
        if (data && data.code === 0) {
          completion({ result: buildResult('添加单词成功') });
        } else {
          completion({ error: buildError('有道词典 cookie 错误或过期，请重新填写。') });
          $log.info('addWord 接口返回值 data : ' + JSON.stringify(data));
        }
      },
    });
  },
  
  /**
   * Validate Youdao Dictionary configuration
   */
  validate(
    _authorization: string,
    _options: ProviderOptions,
    completion: BobValidateCompletion
  ): void {
    // Youdao has no validation logic, return success directly
    completion({ result: true });
  },
};

export default YoudaoProvider;
