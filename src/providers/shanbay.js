/**
 * 扇贝单词 Provider
 * Shanbay Dictionary Provider
 */

var constants = require('../constants.js');
var utils = require('../utils.js');

var USER_AGENT = constants.USER_AGENT;
var buildResult = utils.buildResult;
var buildError = utils.buildError;

var ShanbayProvider = {
    name: '扇贝单词',
    apiUrl: 'https://apiv3.shanbay.com/wordscollection/words_bulk_upload',
    
    /**
     * 添加单词到扇贝单词
     * @param {string} authorization - auth_token 认证信息
     * @param {string} word - 要添加的单词
     * @param {object} options - 额外选项
     * @param {function} completion - 回调函数
     */
    addWord: function(authorization, word, options, completion) {
        $http.post({
            url: this.apiUrl,
            header: {
                "Cookie": "auth_token=" + authorization,
                'Content-Type': 'application/json',
                'User-Agent': USER_AGENT
            },
            body: {
                "business_id": 6,
                "words": [word]
            },
            handler: function(res) {
                if (res.response.statusCode === 200) {
                    completion({'result': buildResult("添加单词成功")});
                } else {
                    completion({'error': buildError('扇贝词典 auth_token 错误或过期，请重新填写。')});
                    $log.info('接口返回值 data : ' + JSON.stringify(res.data));
                }
            }
        });
    },
    
    /**
     * 验证扇贝单词配置
     * @param {string} authorization - auth_token 认证信息
     * @param {object} options - 额外选项
     * @param {function} completion - 回调函数
     */
    validate: function(authorization, options, completion) {
        // 扇贝单词暂无验证逻辑，直接返回成功
        completion({result: true});
    }
};

module.exports = ShanbayProvider;
