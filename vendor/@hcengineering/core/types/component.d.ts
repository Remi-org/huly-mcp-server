import type { Asset, IntlString, Metadata, Plugin, StatusCode } from '@hcengineering/platform';
import { Mixin, Version } from '.';
import type { BenchmarkDoc } from './benchmark';
import type { Account, AnyAttribute, ArrOf, Association, AttachedDoc, Blob, Class, Collection, Configuration, ConfigurationElement, Doc, DocIndexState, DomainIndexConfiguration, Enum, EnumOf, FullTextSearchContext, IndexingConfiguration, Interface, MarkupBlobRef, MigrationState, Obj, Permission, PluginConfiguration, Ref, RefTo, RelatedDocument, Relation, Role, Sequence, Space, SpaceType, SpaceTypeDescriptor, SystemSpace, TransientConfiguration, Type, TypeAny, TypedSpace, UserStatus } from './classes';
import { Status, StatusCategory } from './status';
import type { Tx, TxApplyIf, TxCUD, TxCreateDoc, TxMixin, TxModelUpgrade, TxRemoveDoc, TxUpdateDoc, TxWorkspaceEvent } from './tx';
/**
 * @public
 */
export declare const coreId: Plugin;
/**
 * @public
 */
export declare const systemAccountEmail = "anticrm@hc.engineering";
declare const _default: {
    class: {
        Obj: Ref<Class<Obj>>;
        Doc: Ref<Class<Doc<Space>>>;
        Blob: Ref<Class<Blob>>;
        AttachedDoc: Ref<Class<AttachedDoc<Doc<Space>, string, Space>>>;
        Class: Ref<Class<Class<Obj>>>;
        Mixin: Ref<Class<Mixin<Doc<Space>>>>;
        Interface: Ref<Class<Interface<Doc<Space>>>>;
        Attribute: Ref<Class<AnyAttribute>>;
        Tx: Ref<Class<Tx>>;
        TxModelUpgrade: Ref<Class<TxModelUpgrade>>;
        TxWorkspaceEvent: Ref<Class<TxWorkspaceEvent<any>>>;
        TxApplyIf: Ref<Class<TxApplyIf>>;
        TxCUD: Ref<Class<TxCUD<Doc<Space>>>>;
        TxCreateDoc: Ref<Class<TxCreateDoc<Doc<Space>>>>;
        TxMixin: Ref<Class<TxMixin<Doc<Space>, Doc<Space>>>>;
        TxUpdateDoc: Ref<Class<TxUpdateDoc<Doc<Space>>>>;
        TxRemoveDoc: Ref<Class<TxRemoveDoc<Doc<Space>>>>;
        Space: Ref<Class<Space>>;
        SystemSpace: Ref<Class<SystemSpace>>;
        TypedSpace: Ref<Class<TypedSpace>>;
        SpaceTypeDescriptor: Ref<Class<SpaceTypeDescriptor>>;
        SpaceType: Ref<Class<SpaceType>>;
        Role: Ref<Class<Role>>;
        Permission: Ref<Class<Permission>>;
        Account: Ref<Class<Account>>;
        Type: Ref<Class<Type<any>>>;
        TypeRelation: Ref<Class<Type<string>>>;
        TypeString: Ref<Class<Type<string>>>;
        TypeBlob: Ref<Class<Type<Ref<Blob>>>>;
        TypeIntlString: Ref<Class<Type<IntlString>>>;
        TypeHyperlink: Ref<Class<Type<string>>>;
        TypeNumber: Ref<Class<Type<number>>>;
        TypeFileSize: Ref<Class<Type<number>>>;
        TypeMarkup: Ref<Class<Type<string>>>;
        TypeRank: Ref<Class<Type<string>>>;
        TypeRecord: Ref<Class<Type<Record<any, any>>>>;
        TypeBoolean: Ref<Class<Type<boolean>>>;
        TypeTimestamp: Ref<Class<Type<number>>>;
        TypeDate: Ref<Class<Type<number | Date>>>;
        TypeCollaborativeDoc: Ref<Class<Type<MarkupBlobRef>>>;
        RefTo: Ref<Class<RefTo<Doc<Space>>>>;
        ArrOf: Ref<Class<ArrOf<Doc<Space>>>>;
        Enum: Ref<Class<Enum>>;
        EnumOf: Ref<Class<EnumOf>>;
        Collection: Ref<Class<Collection<AttachedDoc<Doc<Space>, string, Space>>>>;
        TypeAny: Ref<Class<TypeAny<any>>>;
        Version: Ref<Class<Version>>;
        PluginConfiguration: Ref<Class<PluginConfiguration>>;
        UserStatus: Ref<Class<UserStatus>>;
        TypeRelatedDocument: Ref<Class<Type<RelatedDocument>>>;
        DocIndexState: Ref<Class<DocIndexState>>;
        DomainIndexConfiguration: Ref<Class<DomainIndexConfiguration>>;
        Configuration: Ref<Class<Configuration>>;
        Status: Ref<Class<Status>>;
        StatusCategory: Ref<Class<StatusCategory>>;
        MigrationState: Ref<Class<MigrationState>>;
        BenchmarkDoc: Ref<Class<BenchmarkDoc>>;
        FullTextSearchContext: Ref<Mixin<FullTextSearchContext>>;
        Association: Ref<Class<Association>>;
        Relation: Ref<Class<Relation>>;
        Sequence: Ref<Class<Sequence>>;
    };
    icon: {
        TypeString: Asset;
        TypeBlob: Asset;
        TypeHyperlink: Asset;
        TypeNumber: Asset;
        TypeMarkup: Asset;
        TypeRank: Asset;
        TypeRecord: Asset;
        TypeBoolean: Asset;
        TypeDate: Asset;
        TypeRef: Asset;
        TypeArray: Asset;
        TypeEnumOf: Asset;
        TypeCollection: Asset;
    };
    mixin: {
        ConfigurationElement: Ref<Mixin<ConfigurationElement>>;
        IndexConfiguration: Ref<Mixin<IndexingConfiguration<Doc<Space>>>>;
        SpacesTypeData: Ref<Mixin<Space>>;
        TransientConfiguration: Ref<Mixin<TransientConfiguration>>;
    };
    space: {
        Tx: Ref<Space>;
        DerivedTx: Ref<Space>;
        Model: Ref<Space>;
        Space: Ref<TypedSpace>;
        Configuration: Ref<Space>;
        Workspace: Ref<Space>;
    };
    account: {
        System: Ref<Account>;
        ConfigUser: Ref<Account>;
    };
    status: {
        ObjectNotFound: StatusCode<{
            _id: Ref<Doc>;
        }>;
        ItemNotFound: StatusCode<{
            _id: Ref<Doc>;
            _localId: string;
        }>;
    };
    version: {
        Model: Ref<Version>;
    };
    string: {
        Id: IntlString;
        Space: IntlString;
        Spaces: IntlString;
        SpacesDescription: IntlString;
        TypedSpace: IntlString;
        SpaceType: IntlString;
        Modified: IntlString;
        ModifiedDate: IntlString;
        ModifiedBy: IntlString;
        Class: IntlString;
        AttachedTo: IntlString;
        AttachedToClass: IntlString;
        String: IntlString;
        Record: IntlString;
        Markup: IntlString;
        Relation: IntlString;
        Relations: IntlString;
        AddRelation: IntlString;
        Collaborative: IntlString;
        CollaborativeDoc: IntlString;
        MarkupBlobRef: IntlString;
        Number: IntlString;
        Boolean: IntlString;
        Timestamp: IntlString;
        Date: IntlString;
        IntlString: IntlString;
        Ref: IntlString;
        Collection: IntlString;
        Array: IntlString;
        Name: IntlString;
        Enum: IntlString;
        Size: IntlString;
        Description: IntlString;
        ShortDescription: IntlString;
        Descriptor: IntlString;
        TargetClass: IntlString;
        Role: IntlString;
        Roles: IntlString;
        Hyperlink: IntlString;
        Private: IntlString;
        Object: IntlString;
        System: IntlString;
        CreatedBy: IntlString;
        CreatedDate: IntlString;
        Status: IntlString;
        Account: IntlString;
        StatusCategory: IntlString;
        Rank: IntlString;
        Members: IntlString;
        Owners: IntlString;
        Permission: IntlString;
        CreateObject: IntlString;
        UpdateObject: IntlString;
        DeleteObject: IntlString;
        ForbidDeleteObject: IntlString;
        UpdateSpace: IntlString;
        ArchiveSpace: IntlString;
        CreateProject: IntlString;
        CreateObjectDescription: IntlString;
        UpdateObjectDescription: IntlString;
        DeleteObjectDescription: IntlString;
        ForbidDeleteObjectDescription: IntlString;
        UpdateSpaceDescription: IntlString;
        ArchiveSpaceDescription: IntlString;
        CreateProjectDescription: IntlString;
        AutoJoin: IntlString;
        AutoJoinDescr: IntlString;
    };
    descriptor: {
        SpacesType: Ref<SpaceTypeDescriptor>;
    };
    spaceType: {
        SpacesType: Ref<SpaceType>;
    };
    permission: {
        CreateObject: Ref<Permission>;
        UpdateObject: Ref<Permission>;
        DeleteObject: Ref<Permission>;
        ForbidDeleteObject: Ref<Permission>;
        UpdateSpace: Ref<Permission>;
        ArchiveSpace: Ref<Permission>;
        CreateProject: Ref<Permission>;
    };
    role: {
        Admin: Ref<Role>;
    };
    metadata: {
        DisablePermissions: Metadata<boolean>;
    };
};
export default _default;
//# sourceMappingURL=component.d.ts.map