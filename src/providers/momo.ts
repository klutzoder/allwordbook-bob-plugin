/**
 * Momo Dictionary Provider
 * Momo背单词 Provider
 * 
 * 墨墨背单词开放 API 文档: https://open.maimemo.com/
 * API:
 * - GetNotepad: GET /notepads/{notepad_id}
 * - UpdateNotepad: POST /notepads/{notepad_id}
 */

/// <reference path="../types/bob.d.ts" />

import { USER_AGENT } from '../constants';
import { buildResult, buildError } from '../utils';
import type { Provider, ProviderOptions } from '../types/provider';
import type { BobHttpResponse, BobTranslateCompletion, BobValidateCompletion } from '../types/bob';

interface MomoNotepad {
  status?: string;
  content?: string;
  title?: string;
  brief?: string;
  tags?: string[];
}

interface MomoApiResponse {
  success?: boolean;
  data?: {
    notepad?: MomoNotepad;
  };
}

const API_BASE_URL = 'https://open.maimemo.com/open/api/v1';

/**
 * Build request headers for Momo API
 */
function buildHeader(token: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Authorization': token.startsWith('Bearer') ? token : 'Bearer ' + token,
    'User-Agent': USER_AGENT,
  };
}

/**
 * Get notepad content from Momo
 */
function getNotepad(
  token: string,
  notepadId: string,
  callback: (error: string | null, notepad: MomoNotepad | null) => void
): void {
  $http.get({
    url: API_BASE_URL + '/notepads/' + notepadId,
    header: buildHeader(token),
    handler(res: BobHttpResponse) {
      const data = res.data as MomoApiResponse | null;
      if (data?.success && data.data?.notepad) {
        callback(null, data.data.notepad);
      } else {
        let errorMsg = '获取云词本失败';
        if (res.response.statusCode === 401) {
          errorMsg = 'Momo API Token 错误或过期，请重新填写。';
        } else if (res.response.statusCode === 404) {
          errorMsg = '云词本不存在，请检查云词本 ID 是否正确。';
        }
        callback(errorMsg, null);
      }
    },
  });
}

/**
 * Update notepad content in Momo
 */
function updateNotepad(
  token: string,
  notepadId: string,
  notepad: MomoNotepad,
  callback: (error: string | null, success: boolean) => void
): void {
  $http.post({
    url: API_BASE_URL + '/notepads/' + notepadId,
    header: buildHeader(token),
    body: {
      notepad: notepad,
    },
    handler(res: BobHttpResponse) {
      const data = res.data as MomoApiResponse | null;
      if (data?.success) {
        callback(null, true);
      } else {
        callback('更新云词本失败', false);
      }
    },
  });
}

const MomoProvider: Provider = {
  name: 'Momo背单词',
  
  /**
   * Add word to Momo
   */
  addWord(
    authorization: string,
    word: string,
    options: ProviderOptions,
    completion: BobTranslateCompletion
  ): void {
    const notepadId = options.wordbook_id;
    
    if (!notepadId) {
      completion({ error: buildError('请填写 Momo 云词本 ID') });
      return;
    }
    
    // 1. Get notepad content first
    getNotepad(authorization, notepadId, (error, notepad) => {
      if (error || !notepad) {
        completion({ error: buildError(error || '获取云词本失败') });
        return;
      }
      
      // 2. Check if word already exists
      const content = notepad.content || '';
      const lines = content.split('\n').map(line => line.trim());
      
      // Check existence (case-insensitive, exclude title lines and empty lines)
      const existingWords = lines
        .filter(line => line && !line.startsWith('#'))
        .map(line => line.toLowerCase());
      
      if (existingWords.includes(word.toLowerCase())) {
        completion({ result: buildResult('单词 "' + word + '" 在云词本中已存在') });
        return;
      }
      
      // 3. Add date header if not exists for today
      const todayDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
      const todayHeader = '# ' + todayDate;
      let targetLineIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith(todayHeader)) {
          targetLineIndex = i;
          break;
        }
      }
      
      // If today's header doesn't exist, add at beginning
      if (targetLineIndex === -1) {
        lines.unshift('');
        lines.unshift(todayHeader);
        targetLineIndex = 0;
      }
      
      // 4. Insert word after date header
      lines.splice(targetLineIndex + 1, 0, word);
      
      // 5. Build updated notepad object
      const updatedNotepad: MomoNotepad = {
        status: notepad.status || 'PUBLISHED',
        content: lines.join('\n'),
        title: notepad.title,
        brief: notepad.brief,
        tags: notepad.tags,
      };
      
      // 6. Update notepad
      updateNotepad(authorization, notepadId, updatedNotepad, (updateError) => {
        if (updateError) {
          completion({ error: buildError(updateError) });
        } else {
          completion({ result: buildResult('单词 "' + word + '" 添加成功') });
        }
      });
    });
  },
  
  /**
   * Validate Momo configuration
   */
  validate(
    authorization: string,
    options: ProviderOptions,
    completion: BobValidateCompletion
  ): void {
    const notepadId = options.wordbook_id;
    
    if (!notepadId) {
      completion({
        result: false,
        error: {
          type: 'param',
          message: '请填写 Momo 云词本 ID。\n可在墨墨背单词 App「我的 > 更多设置 > 实验功能 > 开放 API」中查看。',
          troubleshootingLink: 'https://open.maimemo.com/',
        },
      });
      return;
    }
    
    // Validate Token and notepad ID
    getNotepad(authorization, notepadId, (error) => {
      if (error) {
        completion({
          result: false,
          error: {
            type: 'param',
            message: error,
            troubleshootingLink: 'https://open.maimemo.com/',
          },
        });
      } else {
        completion({ result: true });
      }
    });
  },
};

export default MomoProvider;
