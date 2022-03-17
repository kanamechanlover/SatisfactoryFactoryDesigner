import { ref } from 'vue'
import { Point } from './point'

/** 
 * 操作状態を表す列挙体（Union型）
 */
export const ControlState = {
    /** 無操作中 */
    Idling: 'Idling',
    /** スクロール中 */
    Scrolling: 'Scrolling',
    /** ノードドラッグ中 */
    DraggingNode: 'DraggingNode',
    /** ノードリサイズ中 */
    ResizingNode: 'ResizingNode',
};
type ControlState = typeof ControlState[keyof typeof ControlState];

/**
 * 操作に関するアクティブな情報
 */
export class Control {
    /** 操作状況 */
    status: ControlState;
    /** 現在のカーソル位置（ブラウザのクライアント領域上） */
    clientPos: Point;
    /** 現在のカーソル位置（エディタ領域上） */
    editorPos: Point;
    /** ドラッグ中の要素（非ドラッグ中は undefined） */
    draggingObject: HTMLElement | null;

    /** コンストラクタ */
    constructor() {
        this.status = ControlState.Idling;
        this.clientPos = new Point();
        this.editorPos = new Point();
        this.draggingObject = null;
    }
};