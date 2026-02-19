import { type ServerConfig } from './config';
import { type ConnectOptions, type PlatformClient } from './types';
/**
 * Create platform client
 * @public */
export declare function connect(url: string, options: ConnectOptions): Promise<PlatformClient>;
export interface WorkspaceToken {
    endpoint: string;
    token: string;
    workspaceId: string;
}
export declare function getWorkspaceToken(url: string, options: ConnectOptions, config?: ServerConfig): Promise<WorkspaceToken>;
//# sourceMappingURL=client.d.ts.map