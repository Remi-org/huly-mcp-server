import type { ClientFactoryOptions } from '@hcengineering/client/src';
import { AccountClient } from '@hcengineering/core';
import { connect } from './connection';
export { connect };
declare const _default: () => Promise<{
    function: {
        GetClient: (token: string, endpoint: string, opt?: ClientFactoryOptions) => Promise<AccountClient>;
    };
}>;
export default _default;
//# sourceMappingURL=index.d.ts.map