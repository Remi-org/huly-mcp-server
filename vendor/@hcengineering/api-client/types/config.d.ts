export interface ServerConfig {
    ACCOUNTS_URL: string;
    COLLABORATOR_URL: string;
    FILES_URL: string;
    UPLOAD_URL: string;
}
export declare function loadServerConfig(url: string): Promise<ServerConfig>;
//# sourceMappingURL=config.d.ts.map