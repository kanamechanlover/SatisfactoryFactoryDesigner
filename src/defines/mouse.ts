/**
 * マウスボタン
 * @note MouseEvent.button に対応した値
 */
export const MouseButton = {
    /** 左ボタン */
    Left: 0,
    /** 中ボタン? */
    Center: 1,
    /** 右ボタン */
    Right: 2,
} as const;
type MouseButton = typeof MouseButton[keyof typeof MouseButton];

/**
 * マウスボタン
 * @note MouseEvent.buttons に対応した値
 * @note 複数のボタンが押されている時はこれらを足した値を使う
 */
 export const MouseButtons = {
    /** ボタンは押されていない */
    Free: 0,
    /** 左ボタン */
    Left: 1,
    /** 右ボタン */
    Right: 2,
    /** 中ボタン */
    Center: 4,
    /** 第4ボタン（戻る） */
    Number4: 8,
    /** 第5ボタン（進む） */
    Number5: 16,
} as const;
type MouseButtons = typeof MouseButtons[keyof typeof MouseButtons];