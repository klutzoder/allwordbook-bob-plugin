/**
 * Constants and Enum Definitions
 * 常量和枚举定义
 */

// Dictionary type enum
export const DictType = {
  YOUDAO: '1',    // 有道词典
  EUDIC: '2',     // 欧路词典
  SHANBAY: '3',   // 扇贝单词
  MOMO: '4',      // Momo背单词
} as const;

export type DictTypeValue = typeof DictType[keyof typeof DictType];

// Common constants
export const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36';
export const TROUBLESHOOTING_LINK = 'https://github.com/yuhaowin/wordbook-bob-plugin';
