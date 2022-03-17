<template>
    <div class="editor-view-frame grid-sheet" ref="frame" data-type="EditorView"
        @mousedown="onMouseAction" @mouseup="onMouseAction" @mousemove="onMouseAction"
        :style="{ 'background-position': position.x + 'px ' + position.y + 'px'}"
    >
        <div class="inner-origin" :style="{
            left: position.x + 'px', top: position.y + 'px'}"
        >
            <div class="origin">
                <div class="origin-point" ref="origin">原点</div>

                <component :is="selectView(entryId)"
                    v-for="entryId in rootEntryIds" :key="entryId"
                    :entry-id="entryId">
                </component>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, Ref, toRef, toRefs, reactive, computed, inject, watch, watchEffect } from 'vue'
    import { Point } from '@/defines/types/point'
    import { MouseButton } from '@/defines/mouse'
    import { ControlState } from '@/defines/types/control'
    import { Stores, useStore } from '@/stores'
    import { Size } from '@/defines/types/size'
    import { selectView } from '@/defines/view'
    import RecipeView from '@/components/Editor/RecipeView.vue'
    import FactoryView from '@/components/Editor/FactoryView.vue'

    /** 内部で扱うメンバ変数を定義 */
    interface Data {
        /** ストア */
        stores: Stores,
        /** エディタ上の原点座標 */
        position: Point,
        /**  */
        prevClientPos: Point,
    };

    /** テンプレート参照する定義 */
    interface Refs {
        frame: Ref<HTMLElement|null>,
        origin: Ref<HTMLElement|null>,
    }

    export default defineComponent({
        name: 'editor-view',
        components: {
            RecipeView,
            FactoryView,
        },
        setup() {
            const state = reactive<Data>({
                /** ストア */
                stores: useStore(),
                /** エディタ上の原点座標 */
                position: new Point(),
                /**  */
                prevClientPos: new Point(),
            });
            const refs: Refs = {
                frame: ref(null),
                origin: ref(null),
            };
            // computed
            const computes = {
                /** ルートノードの子を取得 */
                rootEntryIds: computed(() => {
                    if (!(state.stores.canvas)) return [];
                    return state.stores.canvas.rootList;
                }),
            };
            // methods
            const methods = {
                /** 初期化 */
                initialize: () => {
                    if (!state.stores.canvas) return;
                    state.stores.canvas.reset();
                    const recipe1 = state.stores.canvas.createRecipe("強化鉄板", 100, 1, "0");
                    const recipe2 = state.stores.canvas.createRecipe("ヘビー・モジュラー・フレーム", 150, 2, "0");
                    const recipe3 = state.stores.canvas.createRecipe("鉄のロッド", 100, 1, "0");
                    const recipe4 = state.stores.canvas.createRecipe("ネジ", 100, 1, "0");
                    const factory1 = state.stores.canvas.createFactory("工場（エリア）1", new Point(100, 100), new Size(600, 300));
                    const factory2 = state.stores.canvas.createFactory("工場（エリア）2", new Point(200, 500), new Size(200, 200));
                    state.stores.canvas.moveEntry(recipe1, factory1);
                    state.stores.canvas.moveEntry(recipe2, factory1);
                    state.stores.canvas.moveEntry(recipe3, factory2);
                    state.stores.canvas.moveEntry(recipe4, factory2);
                },
                /** エントリIDに対応したビューを選択 */
                selectView: (entryId: string): string => {
                    return selectView(entryId, state.stores);
                },
                /** 無操作時のマウスイベント処理 */
                onMouseActionIdling: (e: MouseEvent) => {
                    if (!state.stores.control)
                        return; // エラー ts.2532 回避
                    // ボタンが押された
                    if (e.type == "mousedown") {
                        // 左ボタン
                        if (e.button == MouseButton.Left) {
                            // ドラッグできるオブジェクトならドラッグ中にする
                            if (e.target instanceof HTMLElement && e.target.dataset["draggable"]) {
                                //ins.refs.recipeViewContextmenu.show();
                            }
                        }
                        // 右ボタン
                        else if (e.button == MouseButton.Right) {
                            // スクロール操作中並行
                            state.stores.control.setStatus(ControlState.Scrolling);
                            // スクロール操作の為に現在のクライアント領域の座標を取得しておく
                            state.prevClientPos.copy(state.stores.control.clientPos);
                            console.log("スクロール開始");
                        }
                    }
                    // ボタンが離された
                    if (e.type == "mouseup") {
                        // 左ボタン
                        if (e.button == MouseButton.Left) {
                            console.log(state.stores.control.status);
                        }
                    }
                },
                /** スクロール操作時のマウスイベント処理 */
                onMouseActionScrolling: (e: MouseEvent) => {
                    if (!state.stores.control)
                        return; // エラー ts.2532 回避
                    // カーソルが移動した
                    if (e.type == "mousemove") {
                        const dx = state.stores.control.clientPos.x - state.prevClientPos.x;
                        const dy = state.stores.control.clientPos.y - state.prevClientPos.y;
                        state.position.move(dx, dy);
                        state.prevClientPos.copy(state.stores.control.clientPos);
                    }
                    // ボタンが離された
                    if (e.type == "mouseup") {
                        // 右ボタン
                        if (e.button == MouseButton.Right) {
                            state.stores.control.setStatus(ControlState.Idling);
                            console.log("スクロール終了");
                        }
                    }
                },
                /** マウスボタン押下イベント */
                onMouseAction: (e: MouseEvent) => {
                    if (!state.stores.control)
                        return; // エラー ts.2532 回避
                    const frame = refs.frame;
                    // 無操作時の処理
                    if (state.stores.control?.status == ControlState.Idling) {
                        methods.onMouseActionIdling(e);
                    }
                    // スクロール時の処理
                    if (state.stores.control?.status == ControlState.Scrolling) {
                        methods.onMouseActionScrolling(e);
                    }
                }
            };

            // 初期化処理実行
            methods.initialize();

            return {
                ...toRefs(state),
                ...refs,
                ...methods,
                ...computes,
            };
        },
    });

</script>

<style scoped>
    .editor-view-frame {
        overflow: hidden;
        position: relative;
        height: 100%;
        max-height: 100%;
    }
    .inner-origin {
        width: 2px;
        height: 2px;
        position: absolute;
        background: red;
        /* left と top は 変数側で指定する */
    }
    .grid-sheet {
        /* 方眼紙ライクな表示 */
        background-image:
            linear-gradient(
                0deg, transparent 31px,
                gray 32px),
            linear-gradient(
                90deg, transparent 31px,
                gray 32px);
        background-color: dimgray;
        background-size: 32px 32px;
        /*
        background-color: whitesmoke;
        opacity: 0.8;
        background-image:   linear-gradient(silver 2px, transparent 2px),
                            linear-gradient(90deg, silver 2px, transparent 2px),
                            linear-gradient(silver 1px, transparent 1px),
                            linear-gradient(90deg, silver 1px, whitesmoke 1px);
        background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px;
        */
    }
    .origin {
        position: absolute;
    }
    .origin-point {
        width: 50px;
        color: white;
    }
</style>
