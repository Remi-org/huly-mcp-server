/** @public */
export interface LoginInfo {
    token: string;
    endpoint: string;
    confirmed: boolean;
    email: string;
}
/** @public */
export interface WorkspaceLoginInfo extends LoginInfo {
    workspace: string;
    workspaceId: string;
}
export declare function login(accountsUrl: string, user: string, password: string, workspace: string): Promise<string>;
export declare function selectWorkspace(accountsUrl: string, token: string, workspace: string): Promise<WorkspaceLoginInfo>;
//# sourceMappingURL=account.d.ts.map