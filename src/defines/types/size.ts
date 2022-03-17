/**
 * 大きさ（横幅と高さ）を扱うクラス
 */
 export class Size {
    /** 横幅 */
    width: number;
    /** 高さ */
    height: number;

    /**
     * コンストラクタ
     * @param width {number} 横幅
     * @param height {number} 高さ
     */
    constructor(width: number = 0, height: number = 0) {
        this.width = width;
        this.height = height;
    }
    /**
     * 値のコピー
     * @param from {Point} コピー元の Point
     */
    copy(from: Size) {
        this.width = from.width;
        this.height = from.height;
    }
};