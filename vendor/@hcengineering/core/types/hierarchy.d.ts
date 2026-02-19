import { FindOptions, WithLookup } from '.';
import type { AnyAttribute, Class, Classifier, Doc, Domain, Interface, Mixin, Obj, Ref } from './classes';
import type { Tx } from './tx';
/**
 * @public
 */
export declare class Hierarchy {
    private readonly classifiers;
    private readonly attributes;
    private readonly attributesById;
    private readonly descendants;
    private readonly ancestors;
    private readonly proxies;
    private readonly classifierProperties;
    private createMixinProxyHandler;
    private getMixinProxyHandler;
    as<D extends Doc, M extends D>(doc: D, mixin: Ref<Mixin<M>>): M;
    asIf<D extends Doc, M extends D>(doc: D | undefined, mixin: Ref<Mixin<M>>): M | undefined;
    asIfArray<D extends Doc, M extends D>(docs: D[], mixin: Ref<Mixin<M>>): M[];
    static toDoc<D extends Doc>(doc: D): D;
    static mixinClass<D extends Doc, M extends D>(doc: D): Ref<Mixin<M>> | undefined;
    static mixinOrClass<D extends Doc, M extends D>(doc: D): Ref<Mixin<M> | Class<Doc>>;
    static hasMixin<D extends Doc, M extends D>(doc: D, mixin: Ref<Mixin<M>>): boolean;
    hasMixin<D extends Doc, M extends D>(doc: D, mixin: Ref<Mixin<M>>): boolean;
    classHierarchyMixin<D extends Doc, M extends D>(_class: Ref<Class<D>>, mixin: Ref<Mixin<M>>, filter?: (value: M) => boolean): M | undefined;
    findClassOrMixinMixin<D extends Doc, M extends D>(doc: Doc, mixin: Ref<Mixin<M>>): M | undefined;
    findMixinMixins<D extends Doc, M extends D>(doc: Doc, mixin: Ref<Mixin<M>>): M[];
    findAllMixins<D extends Doc, M extends D>(doc: Doc): Ref<Class<M>>[];
    isMixin(_class: Ref<Class<Doc>>): boolean;
    getAncestors(_class: Ref<Classifier>): Ref<Classifier>[];
    getClass<T extends Obj = Obj>(_class: Ref<Class<T>>): Class<T>;
    findClass<T extends Obj = Obj>(_class: Ref<Class<T>>): Class<T> | undefined;
    hasClass<T extends Obj = Obj>(_class: Ref<Class<T>>): boolean;
    getClassOrInterface(_class: Ref<Class<Obj>>): Class<Obj>;
    getInterface(_interface: Ref<Interface<Doc>>): Interface<Doc>;
    getDomain(_class: Ref<Class<Obj>>): Domain;
    findDomain(_class: Ref<Class<Doc>>): Domain | undefined;
    tx(tx: Tx): void;
    private isClassifierTx;
    private txCreateDoc;
    private txUpdateDoc;
    private txRemoveDoc;
    private txMixin;
    /**
     * Check if passed _class is derived from `from` class.
     * It will iterate over parents.
     */
    isDerived<T extends Obj>(_class: Ref<Class<T>>, from: Ref<Class<T>>): boolean;
    /**
     * Return first non interface/mixin parent
     */
    getBaseClass<T extends Doc>(_class: Ref<Mixin<T>>): Ref<Class<T>>;
    /**
     * Check if passed _class implements passed interfaces `from`.
     * It will check for class parents and their interfaces.
     */
    isImplements<T extends Doc>(_class: Ref<Class<T>>, from: Ref<Interface<T>>): boolean;
    /**
     * Check if interface extends passed interface.
     */
    private isExtends;
    getDescendants<T extends Obj>(_class: Ref<Class<T>>): Ref<Class<Obj>>[];
    private updateDescendant;
    private updateAncestors;
    /**
     * Return extends and implemnets as combined list of references
     */
    private ancestorsOf;
    private isClass;
    private _isMixin;
    private isInterface;
    private addAttribute;
    getAllAttributes(clazz: Ref<Classifier>, to?: Ref<Classifier>, traverse?: (name: string, attr: AnyAttribute) => void): Map<string, AnyAttribute>;
    getOwnAttributes(clazz: Ref<Classifier>): Map<string, AnyAttribute>;
    getParentClass(_class: Ref<Class<Obj>>): Ref<Class<Obj>>;
    getAttribute(classifier: Ref<Classifier>, name: string): AnyAttribute;
    findAttribute(classifier: Ref<Classifier>, name: string): AnyAttribute | undefined;
    updateLookupMixin<T extends Doc>(_class: Ref<Class<T>>, result: WithLookup<T>, options?: FindOptions<T>): WithLookup<T>;
    clone(obj: any): any;
    domains(): Domain[];
    getClassifierProp(cl: Ref<Class<Doc>>, prop: string): any | undefined;
    setClassifierProp(cl: Ref<Class<Doc>>, prop: string, value: any): void;
}
//# sourceMappingURL=hierarchy.d.ts.map