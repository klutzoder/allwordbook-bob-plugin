/**
 * 常量和枚举定义
 * Constants and Enum Definitions
 */

// 词典类型枚举
var DictType = {
    YOUDAO: '1',    // 有道词典
    EUDIC: '2',     // 欧路词典
    SHANBAY: '3',   // 扇贝单词
    MOMO: '4'       // Momo背单词
};

// 通用常量
var USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36';
var TROUBLESHOOTING_LINK = 'https://github.com/yuhaowin/wordbook-bob-plugin';

module.exports = {
    DictType: DictType,
    USER_AGENT: USER_AGENT,
    TROUBLESHOOTING_LINK: TROUBLESHOOTING_LINK
};
