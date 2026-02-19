/*!
// Copyright © 2020, 2021 Anticrm Platform Contributors.
// Copyright © 2021 Hardcore Engineering Inc.
//
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
*/
import { Metadata, PluginLoader, PluginModule, Resources } from '.';
/**
 * Id in format 'plugin.resource-kind.id'
 *
 * @public
 */
export type Id = string & {
    __id: true;
};
/**
 * Plugin Id
 *
 * @public
 */
export type Plugin = string & {
    __plugin: true;
};
/**
 * Platform Resource Identifier (PRI)
 *
 * @remarks
 *
 * Almost anything in the Anticrm Platform is a `Resource`. Resources referenced by Platform Resource Identifier (PRI).
 *
 * @example
 * ```typescript
 *   `core.string.ClassLabel` as Resource<string> // translated string according to current language and i18n settings
 *   `workbench.icon.Add` as Resource<URL> // URL to SVG sprites
 * ```
 *
 * @public
 */
export type Resource<T> = Id & {
    __resource: T;
};
/**
 * Internationalized string Id
 *
 * @public
 */
export type IntlString<T extends Record<string, any> = any> = Id & {
    __intl_string: T;
};
/**
 * Status Code. Also works as i18n string Id for status description.
 *
 * @public
 */
export type StatusCode<T extends Record<string, any> = any> = IntlString<T>;
/**
 * @public
 */
export type Namespace = Record<string, Record<string, string>>;
/**
 * @internal
 */
export declare const _ID_SEPARATOR = ":";
/**
 * @internal
 */
export declare const _EmbeddedId = "embedded";
/**
 * @public
 */
export declare function getEmbeddedLabel(str: string): IntlString;
/**
 * Defines plugin Ids.
 *
 * @public
 * @param plugin -
 * @param namespace -
 * @returns
 */
export declare function plugin<N extends Namespace>(plugin: Plugin, namespace: N): N;
/**
 * Merges plugin Ids with Ids provided.
 *
 * @public
 * @param plugin -
 * @param ns -
 * @param merge -
 * @returns
 */
export declare function mergeIds<N extends Namespace, M extends Namespace>(plugin: Plugin, ns: N, merge: M): N & M;
/**
 * @public
 */
export declare const platformId: Plugin;
declare const _default: {
    status: {
        OK: StatusCode<any>;
        BadError: StatusCode<any>;
        UnknownError: StatusCode<{
            message: string;
        }>;
        InvalidId: StatusCode<{
            id: string;
        }>;
        ConnectionClosed: StatusCode<any>;
        LoadingPlugin: StatusCode<{
            plugin: string;
        }>;
        NoLocationForPlugin: StatusCode<{
            plugin: Plugin;
        }>;
        ResourceNotFound: StatusCode<{
            resource: Resource<any>;
        }>;
        NoLoaderForStrings: StatusCode<{
            plugin: Plugin;
        }>;
        BadRequest: StatusCode<any>;
        Forbidden: StatusCode<any>;
        Unauthorized: StatusCode<any>;
        ExpiredLink: StatusCode<any>;
        UnknownMethod: StatusCode<{
            method: string;
        }>;
        InternalServerError: StatusCode<any>;
        MaintenanceWarning: StatusCode<{
            time: number;
        }>;
        AccountNotFound: StatusCode<{
            account: string;
        }>;
        AccountMismatch: StatusCode<{
            account?: string | undefined;
            requiredAccount?: string | undefined;
        }>;
        AccountNotConfirmed: StatusCode<{
            account: string;
        }>;
        WorkspaceNotFound: StatusCode<{
            workspace: string;
        }>;
        WorkspaceArchived: StatusCode<{
            workspace: string;
        }>;
        WorkspaceMigration: StatusCode<{
            workspace: string;
        }>;
        InvalidPassword: StatusCode<{
            account: string;
        }>;
        AccountAlreadyExists: StatusCode<{
            account: string;
        }>;
        AccountAlreadyConfirmed: StatusCode<{
            account: string;
        }>;
        WorkspaceAlreadyExists: StatusCode<{
            workspace: string;
        }>;
        WorkspaceRateLimit: StatusCode<{
            workspace: string;
        }>;
        WorkspaceLimitReached: StatusCode<{
            workspace: string;
        }>;
        InvalidOtp: StatusCode<any>;
        InviteNotFound: StatusCode<{
            email: string;
        }>;
    };
    metadata: {
        locale: Metadata<string>;
        LoadHelper: Metadata<(<T extends Resources>(loader: PluginLoader<T>) => Promise<PluginModule<T>>)>;
    };
};
export default _default;
//# sourceMappingURL=platform.d.ts.map