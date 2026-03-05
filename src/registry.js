/**
 * Provider 注册表
 * Provider Registry
 * 
 * 管理所有词典 Provider 的注册和获取
 */

var constants = require('./constants.js');
var DictType = constants.DictType;

// 导入所有 Provider
var YoudaoProvider = require('./providers/youdao.js');
var EudicProvider = require('./providers/eudic.js');
var ShanbayProvider = require('./providers/shanbay.js');
var MomoProvider = require('./providers/momo.js');

/**
 * Provider 注册表对象
 */
var ProviderRegistry = {
    providers: {},
    
    register: function(dictType, provider) {
        this.providers[dictType] = provider;
    },
    
    get: function(dictType) {
        return this.providers[dictType];
    },
    
    getProviderName: function(dictType) {
        var provider = this.get(dictType);
        return provider ? provider.name : '未知词典';
    }
};

// 注册所有 Provider
ProviderRegistry.register(DictType.YOUDAO, YoudaoProvider);
ProviderRegistry.register(DictType.EUDIC, EudicProvider);
ProviderRegistry.register(DictType.SHANBAY, ShanbayProvider);
ProviderRegistry.register(DictType.MOMO, MomoProvider);

module.exports = ProviderRegistry;
