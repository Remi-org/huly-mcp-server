import { Ref, TxOperations } from '@hcengineering/core';
import { PersonAccount } from '@hcengineering/contact';
import { DirectMessage } from '.';
/**
 * @public
 */
export declare function getDirectChannel(client: TxOperations, me: Ref<PersonAccount>, employeeAccount: Ref<PersonAccount>): Promise<Ref<DirectMessage>>;
//# sourceMappingURL=utils.d.ts.map