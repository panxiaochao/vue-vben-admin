export type Locale = 'en-US' | 'zh-CN';
export declare const messages: Record<Locale, Record<string, string>>;
export declare const getMessages: (locale: Locale) => Record<string, string>;
