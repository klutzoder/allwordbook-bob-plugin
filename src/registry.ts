/**
 * Provider Registry
 * 管理所有词典 Provider 的注册和获取
 */

import { DictType, type DictTypeValue } from './constants';
import type { Provider } from './types/provider';

// Import all providers
import YoudaoProvider from './providers/youdao';
import EudicProvider from './providers/eudic';
import ShanbayProvider from './providers/shanbay';
import MomoProvider from './providers/momo';

/**
 * Provider Registry singleton
 */
class ProviderRegistry {
  private providers: Map<string, Provider> = new Map();
  
  register(dictType: DictTypeValue, provider: Provider): void {
    this.providers.set(dictType, provider);
  }
  
  get(dictType: string): Provider | undefined {
    return this.providers.get(dictType);
  }
  
  getProviderName(dictType: string): string {
    const provider = this.get(dictType);
    return provider ? provider.name : '未知词典';
  }
}

// Create and initialize the registry
const registry = new ProviderRegistry();

// Register all providers
registry.register(DictType.YOUDAO, YoudaoProvider);
registry.register(DictType.EUDIC, EudicProvider);
registry.register(DictType.SHANBAY, ShanbayProvider);
registry.register(DictType.MOMO, MomoProvider);

export default registry;
