import type { IntlString, Plugin } from './platform';
/**
 * @public
 */
export type Loader = (locale: string) => Promise<Record<string, string | Record<string, string>>>;
/**
 * @public
 * @param plugin -
 * @param loader -
 */
export declare function addStringsLoader(plugin: Plugin, loader: Loader): void;
/**
 * Perform load of all internationalization sources for all plugins available.
 * @public
 */
export declare function loadPluginStrings(locale: string, force?: boolean): Promise<void>;
/**
 * @public
 * @param message -
 * @param params -
 * @returns
 */
export declare function translate<P extends Record<string, any>>(message: IntlString<P>, params: P, language?: string): Promise<string>;
/**
 * Will do a translation in case language file already in cache, a translate is called and Promise is returned overwise
 */
export declare function translateCB<P extends Record<string, any>>(message: IntlString<P>, params: P, language: string | undefined, resolve: (value: string) => void): void;
//# sourceMappingURL=i18n.d.ts.map