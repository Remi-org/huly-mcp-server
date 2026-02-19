import { type WorkspaceLoginInfo } from '@hcengineering/account-client';
import { WorkspaceUuid } from '@hcengineering/core';
import { AuthOptions } from './types';
import { ServerConfig } from './config';
export interface WorkspaceToken {
    endpoint: string;
    token: string;
    workspaceId: WorkspaceUuid;
    info: WorkspaceLoginInfo;
}
export declare function getWorkspaceToken(url: string, options: AuthOptions, config?: ServerConfig): Promise<WorkspaceToken>;
//# sourceMappingURL=utils.d.ts.map