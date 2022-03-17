/** ビューに関する定義 */
import { NodeTypeName } from '@/defines/types/editor_model'
import { Stores } from '@/stores'

/** ノードタイプとビュー対応表 */
export const ViewByNodeType = {
    [NodeTypeName.Recipe]: 'recipe-view',
    [NodeTypeName.Factory]: 'factory-view',
};

/**
 * エントリIDに対応したビューを選択
 * @param entryId エントリID
 * @param stores ストア（inject が setup 内でしか使えない為渡す形にした）
 */
export const selectView = (entryId: string, stores: Stores) => {
    if (!stores.canvas) return 'div';
    if (!stores.canvas.hasEntryId(entryId)) return 'div';
    const type = stores.canvas.getEntryById(entryId)?.type;
    if (!type) return 'div';
    return ViewByNodeType[type];
};