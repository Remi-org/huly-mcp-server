import { Asset, IntlString } from '@hcengineering/platform';
import { Attribute, Doc, Domain, Ref } from './classes';
/**
 * @public
 */
export interface StatusCategory extends Doc {
    ofAttribute: Ref<Attribute<Status>>;
    icon: Asset;
    label: IntlString;
    color: number;
    defaultStatusName: string;
    order: number;
}
/**
 * @public
 */
export declare const DOMAIN_STATUS: Domain;
/**
 * @public
 *
 * Status is attached to attribute, and if user attribute will be removed, all status values will be remove as well.
 */
export interface Status extends Doc {
    ofAttribute: Ref<Attribute<Status>>;
    category?: Ref<StatusCategory>;
    name: string;
    color?: number;
    description?: string;
}
//# sourceMappingURL=status.d.ts.map