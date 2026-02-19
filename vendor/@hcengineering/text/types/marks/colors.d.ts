import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';
export interface BackgroundColorOptions {
    types: string[];
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        colors: {
            setTextColor: (color: string) => ReturnType;
            unsetTextColor: () => ReturnType;
            setBackgroundColor: (color: string) => ReturnType;
            unsetBackgroundColor: () => ReturnType;
        };
    }
}
export declare const BackgroundColor: Extension<BackgroundColorOptions, any>;
export interface TextColorOptions {
    types: string[];
}
export declare const TextColor: Extension<TextColorOptions, any>;
//# sourceMappingURL=colors.d.ts.map