/**
 * 欧路词典 Provider
 * Eudic Dictionary Provider
 */

var constants = require('../constants.js');
var utils = require('../utils.js');

var USER_AGENT = constants.USER_AGENT;
var TROUBLESHOOTING_LINK = constants.TROUBLESHOOTING_LINK;
var buildResult = utils.buildResult;
var buildError = utils.buildError;

var EudicProvider = {
    name: '欧路词典',
    apiUrl: 'https://api.frdic.com/api/open/v1/studylist/words',
    bookListUrl: 'https://api.frdic.com/api/open/v1/studylist/category?language=en',
    
    /**
     * 添加单词到欧路词典
     * @param {string} authorization - API Token
     * @param {string} word - 要添加的单词
     * @param {object} options - 额外选项 (需要 wordbook_id)
     * @param {function} completion - 回调函数
     */
    addWord: function(authorization, word, options, completion) {
        var self = this;
        var wordbook_id = options.wordbook_id;
        
        $http.post({
            url: self.apiUrl,
            header: {
                'Authorization': authorization,
                'Content-Type': 'application/json',
                'User-Agent': USER_AGENT
            },
            body: {
                "id": wordbook_id,
                "language": "en",
                "words": [word]
            },
            handler: function(res) {
                if (201 === res.response.statusCode) {
                    completion({'result': buildResult("添加单词成功")});
                } else {
                    completion({'error': buildError('欧路词典 token 错误或过期，请重新填写。')});
                    $log.info('addWord 接口返回值 data : ' + JSON.stringify(res.data));
                }
            }
        });
    },
    
    /**
     * 验证欧路词典配置
     * @param {string} authorization - API Token
     * @param {object} options - 额外选项 (需要 wordbook_id)
     * @param {function} completion - 回调函数
     */
    validate: function(authorization, options, completion) {
        var self = this;
        var wordbook_id = options.wordbook_id;
        
        if (!wordbook_id) {
            self._queryWordbookIds(authorization, completion);
        } else {
            // 测试添加单词验证 token 和 wordbook_id 是否有效
            $http.post({
                url: self.apiUrl,
                header: {
                    'Authorization': authorization,
                    'Content-Type': 'application/json',
                    'User-Agent': USER_AGENT
                },
                body: {
                    "id": wordbook_id,
                    "language": "en",
                    "words": ['test']
                },
                handler: function(res) {
                    if (201 === res.response.statusCode) {
                        completion({result: true});
                    } else {
                        self._queryWordbookIds(authorization, completion);
                    }
                }
            });
        }
    },
    
    /**
     * 查询欧路词典单词本列表
     * @param {string} token - API Token
     * @param {function} completion - 回调函数
     * @private
     */
    _queryWordbookIds: function(token, completion) {
        $http.get({
            url: this.bookListUrl,
            header: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'User-Agent': USER_AGENT
            },
            handler: function(res) {
                var statusCode = res.response.statusCode;
                if (statusCode === 200) {
                    var data = res.data.data;
                    completion({
                        result: false,
                        error: {
                            type: "param",
                            message: "请选择欧路词典单词本 id : \r\n" + JSON.stringify(data, null, 4)
                        }
                    });
                } else {
                    completion({
                        result: false,
                        error: {
                            type: "param",
                            message: "欧路词典 token 错误或过期，请重新填写。",
                            troubleshootingLink: TROUBLESHOOTING_LINK
                        }
                    });
                    $log.info('接口返回值 data : ' + JSON.stringify(res.data));
                }
            }
        });
    }
};

module.exports = EudicProvider;
