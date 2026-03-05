/**
 * Momo背单词 Provider
 * Momo Dictionary Provider
 * 
 * 墨墨背单词开放 API 文档: https://open.maimemo.com/
 * API 说明:
 * - GetNotepad: GET /notepads/{notepad_id} 获取云词本内容
 * - UpdateNotepad: POST /notepads/{notepad_id} 更新云词本内容
 */

var constants = require('../constants.js');
var utils = require('../utils.js');

var USER_AGENT = constants.USER_AGENT;
var TROUBLESHOOTING_LINK = constants.TROUBLESHOOTING_LINK;
var buildResult = utils.buildResult;
var buildError = utils.buildError;

var MomoProvider = {
    name: 'Momo背单词',
    apiBaseUrl: 'https://open.maimemo.com/open/api/v1',
    
    /**
     * 构建请求头
     * @param {string} token - API Token
     * @returns {object} 请求头对象
     */
    _buildHeader: function(token) {
        return {
            'Content-Type': 'application/json',
            'Authorization': token.startsWith('Bearer') ? token : 'Bearer ' + token,
            'User-Agent': USER_AGENT
        };
    },
    
    /**
     * 获取云词本内容
     * @param {string} token - API Token
     * @param {string} notepadId - 云词本 ID
     * @param {function} callback - 回调函数 (error, notepad)
     */
    _getNotepad: function(token, notepadId, callback) {
        var self = this;
        $http.get({
            url: self.apiBaseUrl + '/notepads/' + notepadId,
            header: self._buildHeader(token),
            handler: function(res) {
                var data = res.data;
                if (data && data.success && data.data && data.data.notepad) {
                    callback(null, data.data.notepad);
                } else {
                    var errorMsg = '获取云词本失败';
                    if (res.response.statusCode === 401) {
                        errorMsg = 'Momo API Token 错误或过期，请重新填写。';
                    } else if (res.response.statusCode === 404) {
                        errorMsg = '云词本不存在，请检查云词本 ID 是否正确。';
                    }
                    callback(errorMsg, null);
                }
            }
        });
    },
    
    /**
     * 更新云词本内容
     * @param {string} token - API Token
     * @param {string} notepadId - 云词本 ID
     * @param {object} notepad - 云词本对象 (status, content, title, brief, tags)
     * @param {function} callback - 回调函数 (error, success)
     */
    _updateNotepad: function(token, notepadId, notepad, callback) {
        var self = this;
        $http.post({
            url: self.apiBaseUrl + '/notepads/' + notepadId,
            header: self._buildHeader(token),
            body: {
                notepad: notepad
            },
            handler: function(res) {
                var data = res.data;
                if (data && data.success) {
                    callback(null, true);
                } else {
                    callback('更新云词本失败', false);
                }
            }
        });
    },
    
    /**
     * 添加单词到 Momo背单词
     * @param {string} authorization - API Token
     * @param {string} word - 要添加的单词
     * @param {object} options - 额外选项 (需要 wordbook_id)
     * @param {function} completion - 回调函数
     */
    addWord: function(authorization, word, options, completion) {
        var self = this;
        var notepadId = options.wordbook_id;
        
        if (!notepadId) {
            completion({'error': buildError('请填写 Momo 云词本 ID')});
            return;
        }
        
        // 1. 先获取云词本内容
        self._getNotepad(authorization, notepadId, function(error, notepad) {
            if (error) {
                completion({'error': buildError(error)});
                return;
            }
            
            // 2. 检查单词是否已存在
            var content = notepad.content || '';
            var lines = content.split('\n').map(function(line) {
                return line.trim();
            });
            
            // 检查是否已存在（忽略大小写，排除标题行和空行）
            var existingWords = lines.filter(function(line) {
                return line && !line.startsWith('#');
            }).map(function(line) {
                return line.toLowerCase();
            });
            
            if (existingWords.indexOf(word.toLowerCase()) !== -1) {
                completion({'result': buildResult('单词 "' + word + '" 在云词本中已存在')});
                return;
            }
            
            // 3. 添加日期标题（如果今天的标题不存在）
            var todayDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD 格式
            var todayHeader = '# ' + todayDate;
            var targetLineIndex = -1;
            
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].startsWith(todayHeader)) {
                    targetLineIndex = i;
                    break;
                }
            }
            
            // 如果今天的标题不存在，在开头添加
            if (targetLineIndex === -1) {
                lines.unshift('');
                lines.unshift(todayHeader);
                targetLineIndex = 0;
            }
            
            // 4. 在日期标题后插入单词
            lines.splice(targetLineIndex + 1, 0, word);
            
            // 5. 构建新的云词本对象
            var updatedNotepad = {
                status: notepad.status || 'PUBLISHED',
                content: lines.join('\n'),
                title: notepad.title,
                brief: notepad.brief,
                tags: notepad.tags
            };
            
            // 6. 更新云词本
            self._updateNotepad(authorization, notepadId, updatedNotepad, function(updateError, success) {
                if (updateError) {
                    completion({'error': buildError(updateError)});
                } else {
                    completion({'result': buildResult('单词 "' + word + '" 添加成功')});
                }
            });
        });
    },
    
    /**
     * 验证 Momo背单词 配置
     * @param {string} authorization - API Token
     * @param {object} options - 额外选项 (需要 wordbook_id)
     * @param {function} completion - 回调函数
     */
    validate: function(authorization, options, completion) {
        var self = this;
        var notepadId = options.wordbook_id;
        
        if (!notepadId) {
            completion({
                result: false,
                error: {
                    type: "param",
                    message: "请填写 Momo 云词本 ID。\n可在墨墨背单词 App「我的 > 更多设置 > 实验功能 > 开放 API」中查看。",
                    troubleshootingLink: "https://open.maimemo.com/"
                }
            });
            return;
        }
        
        // 验证 Token 和云词本 ID 是否有效
        self._getNotepad(authorization, notepadId, function(error, notepad) {
            if (error) {
                completion({
                    result: false,
                    error: {
                        type: "param",
                        message: error,
                        troubleshootingLink: "https://open.maimemo.com/"
                    }
                });
            } else {
                completion({result: true});
            }
        });
    }
};

module.exports = MomoProvider;

