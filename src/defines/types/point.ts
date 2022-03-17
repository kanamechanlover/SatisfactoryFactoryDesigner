/**
 * x,y 座標を扱うクラス
 */
export class Point {
    /** x 座標 */
    x: number;
    /** y 座標 */
    y: number;

    /**
     * コンストラクタ
     * @param x {number} x 座標
     * @param y {number} y 座標
     */
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * 相対的な移動
     * @param dx {number} x 方向の移動量
     * @param dy {number} y 方向の移動量
     */
    move(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;
    }

    /**
     * 絶対的な移動
     * @param ax {number} 移動先の x 座標
     * @param ay {number} 移動先の y 座標
     */
    set(ax: number, ay: number) {
        this.x = ax;
        this.y = ay;
    }

    /**
     * 値のコピー
     * @param from {Point} コピー元の Point
     */
    copy(from: Point) {
        this.x = from.x;
        this.y = from.y;
    }
};