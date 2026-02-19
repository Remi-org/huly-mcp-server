import { type Data, type Ref, TxOperations } from '@hcengineering/core';
import type { ColorDefinition } from '@hcengineering/ui';
import { AvatarInfo, AvatarProvider } from '.';
export interface AvatarUrlInfo {
    url: string | undefined;
    srcSet: string | undefined;
    color?: ColorDefinition;
}
export declare function getAvatarProvider(client: TxOperations, providerId: Ref<AvatarProvider>): Promise<AvatarProvider | undefined>;
export declare function getAvatarUrlInfo(client: TxOperations, avatar?: Data<AvatarInfo>, width?: number, name?: string | null): Promise<AvatarUrlInfo>;
export declare function getAvatarDisplayName(name: string | null | undefined): string;
//# sourceMappingURL=avatar.d.ts.map