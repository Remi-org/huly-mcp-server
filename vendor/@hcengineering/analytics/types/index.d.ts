export declare const providers: AnalyticProvider[];
export interface AnalyticProvider {
    init: (config: Record<string, any>) => boolean;
    setUser: (email: string) => void;
    setTag: (key: string, value: string) => void;
    setWorkspace: (ws: string) => void;
    handleEvent: (event: string, params: Record<string, string>) => void;
    handleError: (error: Error) => void;
    navigate: (path: string) => void;
    logout: () => void;
}
export declare const Analytics: {
    init(provider: AnalyticProvider, config: Record<string, any>): void;
    setUser(email: string): void;
    setTag(key: string, value: string): void;
    setWorkspace(ws: string): void;
    handleEvent(event: string, params?: Record<string, any>): void;
    handleError(error: Error): void;
    navigate(path: string): void;
    logout(): void;
};
//# sourceMappingURL=index.d.ts.map