/**
 * 有道词典 Provider
 * Youdao Dictionary Provider
 */

var constants = require('../constants.js');
var utils = require('../utils.js');

var USER_AGENT = constants.USER_AGENT;
var buildResult = utils.buildResult;
var buildError = utils.buildError;

var YoudaoProvider = {
    name: '有道词典',
    apiUrl: 'https://dict.youdao.com/wordbook/webapi/v2/ajax/add?lan=en&word=',
    
    /**
     * 添加单词到有道词典
     * @param {string} authorization - Cookie 认证信息
     * @param {string} word - 要添加的单词
     * @param {object} options - 额外选项
     * @param {function} completion - 回调函数
     */
    addWord: function(authorization, word, options, completion) {
        $http.get({
            url: this.apiUrl + encodeURIComponent(word),
            header: {
                'Cookie': authorization,
                'Host': 'dict.youdao.com',
                'Upgrade-Insecure-Requests': 1,
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'zh-CN,zh;q=0.9',
                'Accept': 'application/json, text/plain, */*',
                'Referer': 'https://dict.youdao.com',
                'User-Agent': USER_AGENT
            },
            handler: function(res) {
                var data = res.data;
                if (data && data.code === 0) {
                    completion({'result': buildResult("添加单词成功")});
                } else {
                    completion({'error': buildError('有道词典 cookie 错误或过期，请重新填写。')});
                    $log.info('addWord 接口返回值 data : ' + JSON.stringify(data));
                }
            }
        });
    },
    
    /**
     * 验证有道词典配置
     * @param {string} authorization - Cookie 认证信息
     * @param {object} options - 额外选项
     * @param {function} completion - 回调函数
     */
    validate: function(authorization, options, completion) {
        // 有道词典暂无验证逻辑，直接返回成功
        completion({result: true});
    }
};

module.exports = YoudaoProvider;
