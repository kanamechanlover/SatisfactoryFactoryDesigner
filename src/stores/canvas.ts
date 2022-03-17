import { ref, reactive } from 'vue'
import {
    EditorNodeModel,
    NodeTypeName,
    RecipeModel,
    FactoryModel,
    EmptyEntryId,
    RootId,
    NoChildTypes
} from '@/defines/types/editor_model';
import { Point } from '@/defines/types/point'
import { Size } from '@/defines/types/size'

export function canvasStore() {
    /** ステート定義 */
    const state = reactive<Array<EditorNodeModel>>([new EditorNodeModel()]);
    /** 次付与するエントリID */
    const nextEntryId = ref(1);
    // 次付与するエントリIDをインクリメント（create したら必ず呼ぶこと）
    const incrementEntryId = () => nextEntryId.value += 1;
    // ID からエントリ取得
    const getEntryById = (id: string): EditorNodeModel|undefined => {
        return state.find((v) => v.entryId == id);
    };
    // state 上に指定IDのエントリがあるか
    const hasEntryId = (id: string): boolean => {
        return getEntryById(id) !== undefined;
    };
    // state 上のエントリの位置（インデックス）取得
    const getEntryIndexById = (entryId: string): number => {
        return state.findIndex((entry: EditorNodeModel) => {
            return entry.entryId === entryId
        });
    };
    
    // 子ノードのエントリIDリストを取得
    const getChildEntryIds = (entryId: string): Array<string> => {
        const entry = getEntryById(entryId);
        if (!entry) return [];
        return entry.childEntryIds;
    };
    // state 上のエントリ削除（インデックス指定）
    const removeEntryByIndex = (index: number) => {
        state.splice(index, 1);
    };
    // state 上のエントリ削除（エントリID指定）
    // ※エントリIDの存在チェックは事前に必ず行うこと。
    // ※再帰処理
    const removeEntryById = (entryId: string) => {
        const entry = getEntryById(entryId);
        if (!entry) return;
        // 子ノードのエントリも削除する
        entry.childEntryIds.forEach((id) => {
            if (hasEntryId(id)) {
                removeEntryById(id);
            }
        });
        switch(entry?.entryId) {
            // 工場（エリア）エントリの場合は内包するエントリも削除する
            case NodeTypeName.Factory:
                break;
        };
        // エントリ削除
        const index = getEntryIndexById(entryId);
        removeEntryByIndex(index);
    };
    // 処理ログ出力
    const showLog = (msg: string) => {
        console.log('[canvas store] ' + msg);
    };
    // 警告ログ出力
    const showWarn = (msg: string) => {
        console.warn('[canvas store] ' + msg);
    };
    // 以下公開する定義
    return {
        /**
         * 指定IDのエントリがあるか
         * @param id エントリID
         */
        hasEntryId: hasEntryId,
        /**
         * id からエントリを取得
         * @param id エントリID
         */
        getEntryById: getEntryById,

        /** ルートに配置されているノードリストを取得 */
        get rootList(): Array<string> {
            return state[RootId].childEntryIds;
        },

        /** レシピリスト取得 */
        get recipeList(): Array<EditorNodeModel> {
            return state.filter((v) => v.type == NodeTypeName.Recipe);
        },

        /** 工場リスト取得 */
        get factoryList(): Array<EditorNodeModel> {
            return state.filter((v) => v.type == NodeTypeName.Factory);
        },

        /**
         * 子ノードのエントリIDリストを取得
         * @param entryId エントリID
         * @returns エントリIDリスト
         */
        getChildEntryIds: getChildEntryIds,

        /**
         * レシピ追加
         * @param recipeName レシピ名
         * @param overclock オーバークロック数
         * @param number 設備台数
         * @param parentEntryId 親ノードのエントリID(省略可)
         * @returns エントリID
         */
        createRecipe: (
            recipeName: string,
            overclock: number,
            number: number,
            parentEntryId: string = RootId.toString()
        ): string => {
            let model = new EditorNodeModel();
            // エントリID
            model.entryId = nextEntryId.value.toString();
            // データタイプ
            model.type = NodeTypeName.Recipe;
            // データ
            model.data = new RecipeModel();
            // レシピ名
            model.data.recipeName = recipeName;
            // オーバークロック数
            model.data.overclock = overclock;
            // 設備台数
            model.data.number = number;
            // 親ノードのエントリID　※存在しないエントリIDならルートノードに入れる
            model.parentEntryId = hasEntryId(parentEntryId) ? parentEntryId : RootId.toString();
            // 親ノードの子にする
            getEntryById(model.parentEntryId)?.childEntryIds.push(model.entryId);

            // 配置
            state.push(model);
            // エントリIDを進める
            incrementEntryId();
            // ログ
            showLog('エントリID.' + model.entryId + ' を作成しました。');
            console.log(model);
            // エントリIDを返す
            return model.entryId;
        },
        
        /**
         * 工場（エリア）追加
         * @param factoryName 工場名
         * @param position 表示位置（x,y）
         * @param frameSize フレームサイズ
         * @param parentEntryId 親ノードのエントリID（省略可）
         * @returns エントリID
         */
        createFactory: (
            factoryName: string,
            position: Point,
            frameSize: Size,
            parentEntryId: string = RootId.toString()
        ): string => {
            let model = new EditorNodeModel();
            // エントリID
            model.entryId = nextEntryId.value.toString();
            // データタイプ
            model.type = NodeTypeName.Factory;
            // データ
            model.data = new FactoryModel();
            // 工場名
            model.data.factoryName = factoryName;
            // 表示位置（x,y）
            model.data.position = position;
            // フレームサイズ
            model.data.frameSize = frameSize;
            // 親ノードのエントリID 
            model.parentEntryId = hasEntryId(parentEntryId) ? parentEntryId : RootId.toString();;
            // 親ノードの子にする
            getEntryById(model.parentEntryId)?.childEntryIds.push(model.entryId);
            // 子ノードのエントリIDリスト
            model.childEntryIds = [];
            // 配置
            state.push(model);
            // エントリIDを進める
            incrementEntryId();
            // ログ
            showLog('エントリID.' + model.entryId + ' を作成しました。');
            console.log(model);
            // エントリIDを返す
            return model.entryId;
        },

        /**
         * レシピエントリを工場（エリア）エントリに移動
         * @param targetEntryId 対象のエントリID
         * @param distinationEntryId 移動先のエントリID
         */
        moveEntry(targetEntryId: string, distinationEntryId: string) {

            // 引数のエントリ存在確認
            const targetEntry = getEntryById(targetEntryId);
            const distinationEntry = getEntryById(distinationEntryId);
            // エントリが無いと実行できない
            if (!targetEntry) {
                showWarn('エントリID.' + targetEntryId + ' は存在しません。');
                return;
            }
            if (!distinationEntry) {
                showWarn('エントリID.' + distinationEntryId + ' は存在しません。');
                return;
            }
            // 移動先が子ノードを持てないタイプの場合は何もしない
            if (distinationEntry.type in NoChildTypes) {
                showWarn('エントリID.' + distinationEntryId + ' は移動先に指定できません。');
                return;
            }
            // 対象のエントリの親ノード側から対象のエントリIDを削除
            const parentEntry = getEntryById(targetEntry.parentEntryId);
            if (!parentEntry) return; // ここに入る場合もうストアが壊れてる
            parentEntry.childEntryIds = parentEntry.childEntryIds.filter((id) => id != targetEntryId);

            // 対象のエントリの親ノードを変更
            targetEntry.parentEntryId = distinationEntryId;

            // 移動先のエントリに対象のエントリを追加
            distinationEntry.childEntryIds.push(targetEntryId);

            showLog('エントリID.' + targetEntryId + ' が エントリID.' + distinationEntryId + 'の子になりました。');
        },

        /**
         * エントリ削除
         * @param entryId エントリID
         */
        removeEntryById: (entryId: string) => {
            if (hasEntryId(entryId)) {
                // エントリが無いと実行できない
                showWarn('エントリID.' + entryId + ' は存在しません。');
                return;
            }
            removeEntryById(entryId);
        },
        /**
         * 工場（エリア）のデータ更新
         * @param entryId エントリID
         * @param model 更新後のデータ
         */
        setFactoryModel: (entryId: string, model: FactoryModel) => {
            if (!hasEntryId(entryId)) {
                // エントリが無いと実行できない
                showWarn('エントリID.' + entryId + ' は存在しません。');
                return;
            }
            const index = getEntryIndexById(entryId);
            if (state[index].type != NodeTypeName.Factory) {
                showWarn('工場（エリア）データを持たないエントリIDです。');
                return;
            }
            // データ変更
            (state[index].data as FactoryModel) = model;
        },
        
        /**
         * レシピのデータ更新
         * @param entryId エントリID
         * @param model 更新後のデータ
         */
        setRecipeModel: (entryId: string, model: RecipeModel) => {
            if (!hasEntryId(entryId)) {
                // エントリが無いと実行できない
                showWarn('エントリID.' + entryId + ' は存在しません。');
                return;
            }
            const index = getEntryIndexById(entryId);
            if (state[index].type != NodeTypeName.Recipe) {
                showWarn('レシピデータを持たないエントリIDです。');
                return;
            }
            // データ変更
            (state[index].data as RecipeModel) = model;
        },

        /** リセット */
        reset: () => {
            // ルートノードを除いて全削除
            state.splice(1);
            // ルートノードの子要素を全削除
            state[RootId].childEntryIds.splice(0);
            // 付与するエントリIDをリセット
            nextEntryId.value = 1;
        },
    };
}
export type CanvasStore = ReturnType<typeof canvasStore>;