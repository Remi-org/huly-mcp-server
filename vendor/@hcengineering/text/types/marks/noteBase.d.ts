import { Mark } from '@tiptap/core';
export declare const name = "note";
export declare enum NoteKind {
    Neutral = "neutral",
    Dangerous = "dangerous",
    DangerousLight = "dangerous-light",
    Warning = "warning",
    WarningLight = "warning-light",
    Positive = "positive",
    PositiveLight = "positive-light",
    Primary = "primary",
    PrimaryLight = "primary-light"
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        [name]: {
            setNote: (text: string, kind: NoteKind) => ReturnType;
            unsetNote: () => ReturnType;
        };
    }
}
export declare const NoteBaseExtension: Mark<any, any>;
//# sourceMappingURL=noteBase.d.ts.map