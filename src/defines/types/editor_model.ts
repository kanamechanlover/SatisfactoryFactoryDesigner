/**
 * エディタ上に配置されているノードのモデル群
 */
import { Point } from './point'
import { Size } from './size'

/** 空のエントリID */
export const EmptyEntryId = 'None';
/** ルートノードを指すエントリID */
export const RootId = 0;

/**
 * レシピモデル
 */
export class RecipeModel {
    /** レシピ名（Config と対応） */
    recipeName: string = 'レシピ名';
    /** オーバークロック数(50, 100, 150, 200, 250) */
    overclock: number = 100;
    /** 設備台数 */
    number: number = 1;
}

/**
 * 工場（エリア）モデル
 */
export class FactoryModel {
    /** 工場名 */
    factoryName: string = '工場名';
    /** 表示位置（x,y） */
    position: Point = new Point();
    /** フレームサイズ */
    frameSize: Size = new Size();
}

/**
 * 運搬ラインモデル
 */
export class LogisticsLineModel {
    /** 発送側のエントリID */
    exportId: string = '';
    /** 受取側のエントリID */
    importId: string = '';
}

/**
 * 資源ノードモデル
 */
export class ResourceModel {
    /** 資源名 */
    resourceName: string = '';
    /** 純度（'Impure', 'Normal', 'Pure'） */
    purity: string = '';
    /** 採取対象のレシピID */
    recipeId: string = '';
    /** 表示位置（x,y） */
    position: Point = new Point();
}

/** ノードタイプ名 */
export const NodeTypeName = {
    Root: 'Root',
    Recipe: 'Recipe',
    Factory: 'Factory',
    LogisticsLine: 'LogisticsLine',
    ResourceNode: 'ResourceNode',
} as const;
export type NodeType = keyof typeof NodeTypeName;
export type EditorNodeData = RecipeModel|FactoryModel|LogisticsLineModel|ResourceModel;

/** 子ノードを持てないノードタイプ */
export const NoChildTypes = [
    NodeTypeName.Recipe,
    NodeTypeName.LogisticsLine,
];

/**
 * エディタ配置ノードモデル
 */
export class EditorNodeModel {
    /** エントリID */
    entryId: string = '0';
    /** ノードタイプ（'Recipe', 'Factory', 'LogisticsLine', 'ResourceNode'） */
    type: NodeType = NodeTypeName.Root;
    /** ノードタイプ毎のデータ */
    data?: EditorNodeData = undefined;
    /** 親ノードのエントリID */
    parentEntryId: string = EmptyEntryId;
    /** 子ノードのエントリIDリスト */
    childEntryIds: Array<string> = [];
}