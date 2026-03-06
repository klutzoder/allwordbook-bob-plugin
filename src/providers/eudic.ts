/**
 * Eudic Dictionary Provider
 * 欧路词典 Provider
 */

/// <reference path="../types/bob.d.ts" />

import { USER_AGENT, TROUBLESHOOTING_LINK } from '../constants';
import { buildResult, buildError } from '../utils';
import type { Provider, ProviderOptions } from '../types/provider';
import type { BobHttpResponse, BobTranslateCompletion, BobValidateCompletion } from '../types/bob';

interface WordbookCategory {
  id: string;
  name: string;
}

const EudicProvider: Provider = {
  name: '欧路词典',
  
  /**
   * Add word to Eudic Dictionary
   */
  addWord(
    authorization: string,
    word: string,
    options: ProviderOptions,
    completion: BobTranslateCompletion
  ): void {
    const apiUrl = 'https://api.frdic.com/api/open/v1/studylist/words';
    const wordbookId = options.wordbook_id;
    
    $http.post({
      url: apiUrl,
      header: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT,
      },
      body: {
        id: wordbookId,
        language: 'en',
        words: [word],
      },
      handler(res: BobHttpResponse) {
        if (res.response.statusCode === 201) {
          completion({ result: buildResult('添加单词成功') });
        } else {
          completion({ error: buildError('欧路词典 token 错误或过期，请重新填写。') });
          $log.info('addWord 接口返回值 data : ' + JSON.stringify(res.data));
        }
      },
    });
  },
  
  /**
   * Validate Eudic Dictionary configuration
   */
  validate(
    authorization: string,
    options: ProviderOptions,
    completion: BobValidateCompletion
  ): void {
    const apiUrl = 'https://api.frdic.com/api/open/v1/studylist/words';
    const wordbookId = options.wordbook_id;
    
    if (!wordbookId) {
      queryWordbookIds(authorization, completion);
      return;
    }
    
    // Test adding a word to validate token and wordbook_id
    $http.post({
      url: apiUrl,
      header: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT,
      },
      body: {
        id: wordbookId,
        language: 'en',
        words: ['test'],
      },
      handler(res: BobHttpResponse) {
        if (res.response.statusCode === 201) {
          completion({ result: true });
        } else {
          queryWordbookIds(authorization, completion);
        }
      },
    });
  },
};

/**
 * Query Eudic wordbook list
 */
function queryWordbookIds(
  token: string,
  completion: BobValidateCompletion
): void {
  const bookListUrl = 'https://api.frdic.com/api/open/v1/studylist/category?language=en';
  
  $http.get({
    url: bookListUrl,
    header: {
      'Authorization': token,
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
    },
    handler(res: BobHttpResponse) {
      const statusCode = res.response.statusCode;
      if (statusCode === 200) {
        const responseData = res.data as { data?: WordbookCategory[] } | null;
        const data = responseData?.data;
        completion({
          result: false,
          error: {
            type: 'param',
            message: '请选择欧路词典单词本 id : \r\n' + JSON.stringify(data, null, 4),
          },
        });
      } else {
        completion({
          result: false,
          error: {
            type: 'param',
            message: '欧路词典 token 错误或过期，请重新填写。',
            troubleshootingLink: TROUBLESHOOTING_LINK,
          },
        });
        $log.info('接口返回值 data : ' + JSON.stringify(res.data));
      }
    },
  });
}

export default EudicProvider;
