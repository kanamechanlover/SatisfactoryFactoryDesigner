import { reactive } from 'vue'
import { Control } from '@/defines/types/control';

export function controlStore() {
    const state = reactive(new Control());
    return {
        /** 操作状況 */
        get status() {
            return state.status;
        },
        /** 操作状況更新 */
        setStatus(newState: string) {
            state.status = newState;
        },
        /** 現在のカーソル位置（ブラウザのクライアント領域上） */
        get clientPos() {
            return state.clientPos;
        },
        /** 現在のカーソル位置（ブラウザのクライアント領域上）更新 */
        setClientPos(x: number, y: number) {
            state.clientPos.x = x;
            state.clientPos.y = y;
        },
        /** 現在のカーソル位置（エディタ領域上） */
        get editorPos() {
            return state.editorPos;
        },
        /** 現在のカーソル位置（エディタ領域上）更新 */
        setEditorPos(x: number, y: number) {
            state.editorPos.x = x;
            state.editorPos.y = y;
        },
        /** ドラッグ対象のオブジェクト */
        get draggingObject() {
            return state.draggingObject;
        },
        /** ドラッグ対象のオブジェクトを設定 */
        setDraggingObject(object: HTMLElement | null = null) {
            state.draggingObject = object;
        },
    };
}
export type ControlStore = ReturnType<typeof controlStore>;