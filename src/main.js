/**
 * 单词本插件 - Wordbook Bob Plugin
 * 
 * 支持多种单词本服务的 Bob 翻译插件
 * Supports: 有道词典, 欧路词典, 扇贝单词, Momo背单词
 * 
 * 文件结构:
 * - main.js          : 入口文件，实现 Bob 插件接口
 * - constants.js     : 常量和枚举定义
 * - utils.js         : 工具函数
 * - registry.js      : Provider 注册表
 * - providers/       : 各词典 Provider 实现
 *   - youdao.js      : 有道词典
 *   - eudic.js       : 欧路词典
 *   - shanbay.js     : 扇贝单词
 *   - momo.js        : Momo背单词
 */

// 导入模块
var utils = require('./utils.js');
var ProviderRegistry = require('./registry.js');

var buildResult = utils.buildResult;
var buildError = utils.buildError;
var buildValidationError = utils.buildValidationError;

// ============================================================
// Bob 插件接口实现 - Bob Plugin Interface
// ============================================================

/**
 * 获取支持的语言列表
 * @returns {string[]} 支持的语言代码数组
 */
function supportLanguages() {
    return ['zh-Hans', 'en'];
}

/**
 * 插件验证
 * @param {function} completion - 验证完成回调函数
 */
function pluginValidate(completion) {
    var selected_dict = $option.dict_type;
    var authorization = $option.authorization;
    
    if (!authorization) {
        completion(buildValidationError("未设置认证信息。"));
        return;
    }
    
    var provider = ProviderRegistry.get(selected_dict);
    if (!provider) {
        completion(buildValidationError("未知的词典类型。"));
        return;
    }
    
    var options = {
        wordbook_id: $option.wordbook_id
    };
    
    provider.validate(authorization, options, completion);
}

/**
 * 翻译/添加单词
 * @param {object} query - 查询对象
 * @param {function} completion - 完成回调函数
 */
function translate(query, completion) {
    var text = query.text;
    var from_language = query.detectFrom;
    var selected_dict = $option.dict_type;
    var word_only = $option.word_only;
    var authorization = $option.authorization;
    
    // 检查是否需要保存
    var need_save = (word_only == 0 || text.search(' ') < 1);
    if (from_language != 'en' || !need_save) {
        completion({'result': buildResult("中文、非英语单词无需添加单词本")});
        return;
    }
    
    // 检查认证信息
    if (!authorization) {
        completion({'error': buildError('「认证信息」缺失')});
        return;
    }
    
    // 获取对应的 Provider 并添加单词
    var provider = ProviderRegistry.get(selected_dict);
    if (!provider) {
        completion({'error': buildError('未知的词典类型')});
        return;
    }
    
    var options = {
        wordbook_id: $option.wordbook_id
    };
    
    provider.addWord(authorization, text, options, completion);
}

