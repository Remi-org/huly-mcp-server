import type { Asset, IntlString, Plugin } from '@hcengineering/platform';
import type { DocumentQuery } from './storage';
/**
 * @public
 */
export type Ref<T extends Doc> = string & {
    __ref: T;
};
/**
 * @public
 */
export type PrimitiveType = number | string | boolean | undefined | Ref<Doc>;
/**
 * @public
 */
export type Timestamp = number;
/**
 * @public
 */
export type Markup = string;
/**
 * @public
 */
export type Hyperlink = string;
/**
 * @public
 */
export type CollectionSize<T> = T[]['length'];
/**
 * @public
 *
 * String representation of {@link https://www.npmjs.com/package/lexorank LexoRank} type
 */
export type Rank = string;
/**
 * @public
 *
 * Reference to blob containing snapshot of collaborative doc.
 */
export type MarkupBlobRef = Ref<Blob>;
/**
 * @public
 */
export interface Obj {
    _class: Ref<Class<this>>;
}
/**
 * @public
 */
export interface Doc<S extends Space = Space> extends Obj {
    _id: Ref<this>;
    space: Ref<S>;
    modifiedOn: Timestamp;
    modifiedBy: Ref<Account>;
    createdBy?: Ref<Account>;
    createdOn?: Timestamp;
}
/**
 * @public
 */
export type PropertyType = any;
/**
 * @public
 */
export interface UXObject extends Obj {
    label: IntlString;
    icon?: Asset;
    hidden?: boolean;
    readonly?: boolean;
}
/**
 * @public
 */
export interface Association extends Doc {
    classA: Ref<Class<Doc>>;
    classB: Ref<Class<Doc>>;
    nameA: string;
    nameB: string;
    type: '1:1' | '1:N' | 'N:N';
}
/**
 * @public
 */
export interface Relation extends Doc {
    docA: Ref<Doc>;
    docB: Ref<Doc>;
    association: Ref<Association>;
}
/**
 * @public
 */
export interface AttachedDoc<Parent extends Doc = Doc, Collection extends Extract<keyof Parent, string> | string = Extract<keyof Parent, string> | string, S extends Space = Space> extends Doc<S> {
    attachedTo: Ref<Parent>;
    attachedToClass: Ref<Class<Parent>>;
    collection: Collection;
}
/**
 * @public
 */
export interface Type<T extends PropertyType> extends UXObject {
}
/**
 * @public
 */
export declare enum IndexKind {
    /**
     * Attribute with this index annotation should be added to elastic for search
     * Could be added to string or Ref attribute
     * TODO: rename properly for better code readability
     */
    FullText = 0,
    /**
     * For attribute with this annotation should be created an index in mongo database
     *
     * Also mean to include into Elastic search.
     */
    Indexed = 1,
    IndexedDsc = 2
}
/**
 * @public
 */
export interface Enum extends Doc {
    name: string;
    enumValues: string[];
}
/**
 * @public
 */
export interface Attribute<T extends PropertyType> extends Doc, UXObject {
    attributeOf: Ref<Class<Obj>>;
    name: string;
    type: Type<T>;
    index?: IndexKind;
    shortLabel?: IntlString;
    isCustom?: boolean;
    defaultValue?: any;
    [key: string]: any;
}
/**
 * @public
 */
export type AnyAttribute = Attribute<Type<any>>;
/**
 * @public
 */
export declare enum ClassifierKind {
    CLASS = 0,
    INTERFACE = 1,
    MIXIN = 2
}
/**
 * @public
 */
export interface Classifier extends Doc, UXObject {
    kind: ClassifierKind;
}
/**
 * @public
 */
export type Domain = string & {
    __domain: true;
};
/**
 * @public
 */
export interface Interface<T extends Doc> extends Classifier {
    extends?: Ref<Interface<Doc>>[];
}
/**
 * @public
 */
export interface Class<T extends Obj> extends Classifier {
    extends?: Ref<Class<Obj>>;
    implements?: Ref<Interface<Doc>>[];
    domain?: Domain;
    shortLabel?: string;
    sortingKey?: string;
    filteringKey?: string;
    pluralLabel?: IntlString;
}
/**
 * @public
 * Define a set of plugin to model document bindings.
 */
export interface PluginConfiguration extends Doc {
    pluginId: Plugin;
    transactions: Ref<Doc>[];
    label?: IntlString;
    icon?: Asset;
    description?: IntlString;
    enabled: boolean;
    hidden?: boolean;
    beta: boolean;
    classFilter?: Ref<Class<Obj>>[];
}
/**
 * @public
 */
export type Mixin<T extends Doc> = Class<T>;
/**
 * @public
 */
export type Data<T extends Doc> = Omit<T, keyof Doc>;
/**
 * @public
 */
export type AttachedData<T extends AttachedDoc> = Omit<T, keyof AttachedDoc>;
/**
 * @public
 */
export type DocData<T extends Doc> = T extends AttachedDoc ? AttachedData<T> : Data<T>;
/**
 * @public
 */
export declare enum DateRangeMode {
    DATE = "date",
    TIME = "time",
    DATETIME = "datetime",
    TIMEONLY = "timeonly"
}
/**
 * @public
 */
export interface TypeDate extends Type<Date> {
    mode: DateRangeMode;
    withShift: boolean;
}
/**
 * @public
 */
export interface RefTo<T extends Doc> extends Type<Ref<Class<T>>> {
    to: Ref<Class<T>>;
}
/**
 * @public
 */
export interface Collection<T extends AttachedDoc> extends Type<CollectionSize<T>> {
    of: Ref<Class<T>>;
    itemLabel?: IntlString;
}
/**
 * @public
 */
export type Arr<T extends PropertyType> = T[];
/**
 * @public
 */
export interface ArrOf<T extends PropertyType> extends Type<T[]> {
    of: Type<T>;
}
/**
 * @public
 */
export interface EnumOf extends Type<string> {
    of: Ref<Enum>;
}
/**
 * @public
 */
export interface TypeHyperlink extends Type<Hyperlink> {
}
/**
 * @public
 *
 * A type for some custom serialized field with a set of editors
 */
export interface TypeAny<AnyComponent = any> extends Type<any> {
    presenter: AnyComponent;
    editor?: AnyComponent;
}
/**
 * @public
 */
export declare const DOMAIN_MODEL: Domain;
/**
 * @public
 */
export declare const DOMAIN_MODEL_TX: Domain;
/**
 * @public
 */
export declare const DOMAIN_SPACE: Domain;
/**
 * @public
 */
export declare const DOMAIN_CONFIGURATION: Domain;
/**
 * @public
 */
export declare const DOMAIN_MIGRATION: Domain;
/**
 * @public
 */
export declare const DOMAIN_TRANSIENT: Domain;
/**
 * @public
 */
export declare const DOMAIN_RELATION: Domain;
/**
 * @public
 */
export interface TransientConfiguration extends Class<Doc> {
    broadcastOnly: boolean;
}
/**
 * Special domain to access s3 blob data.
 * @public
 */
export declare const DOMAIN_BLOB: Domain;
export declare const DOMAIN_DOC_INDEX_STATE: Domain;
/**
 * @public
 */
export declare const DOMAIN_SEQUENCE: Domain;
/**
 * @public
 */
export interface Space extends Doc {
    name: string;
    description: string;
    private: boolean;
    members: Arr<Ref<Account>>;
    archived: boolean;
    owners?: Ref<Account>[];
    autoJoin?: boolean;
}
/**
 * @public
 */
export interface SystemSpace extends Space {
}
/**
 * @public
 *
 * Space with custom configured type
 */
export interface TypedSpace extends Space {
    type: Ref<SpaceType>;
}
/**
 * @public
 *
 * Is used to describe "types" for space type
 */
export interface SpaceTypeDescriptor extends Doc {
    name: IntlString;
    description: IntlString;
    icon: Asset;
    baseClass: Ref<Class<Space>>;
    availablePermissions: Ref<Permission>[];
    system?: boolean;
}
/**
 * @public
 *
 * Customisable space type allowing to configure space roles and permissions within them
 */
export interface SpaceType extends Doc {
    name: string;
    shortDescription?: string;
    descriptor: Ref<SpaceTypeDescriptor>;
    members?: Ref<Account>[];
    autoJoin?: boolean;
    targetClass: Ref<Class<Space>>;
    roles: CollectionSize<Role>;
}
/**
 * @public
 * Role defines permissions for employees assigned to this role within the space
 */
export interface Role extends AttachedDoc<SpaceType, 'roles'> {
    name: string;
    permissions: Ref<Permission>[];
}
/**
 * @public
 * Defines assignment of employees to a role within a space
 */
export type RolesAssignment = Record<Ref<Role>, Ref<Account>[] | undefined>;
/**
 * @public
 * Permission is a basic access control item in the system
 */
export interface Permission extends Doc {
    label: IntlString;
    description?: IntlString;
    icon?: Asset;
}
/**
 * @public
 */
export interface Account extends Doc {
    email: string;
    role: AccountRole;
    person?: Ref<Doc>;
}
/**
 * @public
 */
export declare enum AccountRole {
    DocGuest = "DocGuest",
    Guest = "GUEST",
    User = "USER",
    Maintainer = "MAINTAINER",
    Owner = "OWNER"
}
/**
 * @public
 */
export declare const roleOrder: Record<AccountRole, number>;
/**
 * @public
 */
export interface UserStatus extends Doc {
    online: boolean;
    user: Ref<Account>;
}
/**
 * @public
 */
export interface Version extends Doc {
    major: number;
    minor: number;
    patch: number;
}
/**
 * @public
 */
export interface MigrationState extends Doc {
    plugin: string;
    state: string;
}
/**
 * @public
 */
export declare function versionToString(version: Version | Data<Version>): string;
/**
 * @public
 *
 * Define status for full text indexing
 */
export interface DocIndexState extends Doc {
    objectClass: Ref<Class<Doc>>;
    needIndex: boolean;
    removed: boolean;
}
/**
 * @public
 */
export interface Sequence extends Doc {
    attachedTo: Ref<Class<Doc>>;
    sequence: number;
}
/**
 * @public
 */
export type BlobMetadata = Record<string, any>;
/**
 * @public
 *
 * A blob document to manage blob attached documents.
 *
 * _id: is a platform ID and it created using our regular generateId(),
 * and storageId is a provider specified storage id.
 */
export interface Blob extends Doc {
    provider: string;
    contentType: string;
    etag: string;
    version: string | null;
    size: number;
}
/**
 * For every blob will automatically add a lookup.
 *
 * It extends Blob to allow for $lookup operations work as expected.
 */
export interface BlobLookup extends Blob {
    downloadUrl: string;
    downloadUrlExpire?: number;
}
/**
 * @public
 *
 * If defined for class, this class will be enabled for embedding search like openai.
 */
export interface FullTextSearchContext extends Doc {
    toClass: Ref<Class<Doc>>;
    fullTextSummary?: boolean;
    forceIndex?: boolean;
    propagate?: Ref<Class<Doc>>[];
    propagateClasses?: Ref<Class<Doc>>[];
    childProcessingAllowed?: boolean;
}
/**
 * @public
 */
export interface ConfigurationElement extends Class<Doc> {
    title: IntlString;
    group: IntlString;
}
export interface BlobType {
    file: Ref<Blob>;
    type: string;
    name: string;
    metadata?: BlobMetadata;
}
export type Blobs = Record<string, BlobType>;
/**
 * @public
 *
 * Define configuration value configuration for workspace.
 *
 * Configuration is accessible only for owners of workspace and under hood services.
 */
export interface Configuration extends Doc {
    enabled: boolean;
}
/**
 * @public
 */
export type RelatedDocument = Pick<Doc, '_id' | '_class'>;
/**
 * @public
 */
export declare enum IndexOrder {
    Ascending = 1,
    Descending = -1
}
/**
 * @public
 */
export type FieldIndex<T extends Doc> = {
    [P in keyof T]?: IndexOrder;
} & Record<string, IndexOrder>;
export interface FieldIndexConfig<T extends Doc> {
    sparse?: boolean;
    filter?: Omit<DocumentQuery<T>, '$search'>;
    keys: FieldIndex<T> | string;
}
/**
 * @public
 *
 * Mixin for extra indexing fields.
 */
export interface IndexingConfiguration<T extends Doc> extends Class<Doc> {
    indexes: (string | FieldIndexConfig<T>)[];
    searchDisabled?: boolean;
}
export interface DomainIndexConfiguration extends Doc {
    domain: Domain;
    disableCollection?: boolean;
    disabled?: (FieldIndex<Doc> | string)[];
    indexes?: (FieldIndexConfig<Doc> | string)[];
    skip?: string[];
}
export type WorkspaceMode = 'manual-creation' | 'pending-creation' | 'creating' | 'upgrading' | 'pending-deletion' | 'deleting' | 'active' | 'deleted' | 'archiving-pending-backup' | 'archiving-backup' | 'archiving-pending-clean' | 'archiving-clean' | 'archived' | 'migration-pending-backup' | 'migration-backup' | 'migration-pending-clean' | 'migration-clean' | 'pending-restore' | 'restoring';
export declare function isActiveMode(mode?: WorkspaceMode): boolean;
export declare function isDeletingMode(mode: WorkspaceMode): boolean;
export declare function isArchivingMode(mode?: WorkspaceMode): boolean;
export declare function isMigrationMode(mode?: WorkspaceMode): boolean;
export declare function isRestoringMode(mode?: WorkspaceMode): boolean;
export declare function isUpgradingMode(mode?: WorkspaceMode): boolean;
export type WorkspaceUpdateEvent = 'ping' | 'create-started' | 'create-done' | 'upgrade-started' | 'upgrade-done' | 'restore-started' | 'restore-done' | 'progress' | 'migrate-backup-started' | 'migrate-backup-done' | 'migrate-clean-started' | 'migrate-clean-done' | 'archiving-backup-started' | 'archiving-backup-done' | 'archiving-clean-started' | 'archiving-clean-done' | 'archiving-done' | 'delete-started' | 'delete-done';
export interface BackupStatus {
    dataSize: number;
    blobsSize: number;
    backupSize: number;
    lastBackup: Timestamp;
    backups: number;
}
export interface BaseWorkspaceInfo {
    workspace: string;
    uuid?: string;
    disabled?: boolean;
    version?: Data<Version>;
    branding?: string;
    workspaceUrl?: string | null;
    workspaceName?: string;
    createdOn: number;
    lastVisit: number;
    createdBy: string;
    mode: WorkspaceMode;
    progress?: number;
    endpoint: string;
    region?: string;
    targetRegion?: string;
    backupInfo?: BackupStatus;
}
/**
 * @public
 */
export type ClientWorkspaceInfo = Omit<BaseWorkspaceInfo, 'workspaceUrl'> & {
    lastProcessingTime?: number;
    attempts?: number;
    message?: string;
    workspaceId: string;
};
//# sourceMappingURL=classes.d.ts.map