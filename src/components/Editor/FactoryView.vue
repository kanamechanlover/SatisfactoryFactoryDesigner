<template>
    <div class="factory-view-frame" :style="frameStyle">
        <div class="factory-name">{{ factoryName }}</div>
        <div class="factory-in" ref="innerArea">
            <component :is="selectView(entryId)"
                v-for="entryId in productions" :key="entryId"
                :entry-id="entryId">
            </component>
        </div>
        <div class="resize-manipulator" @mousedown.stop="onMouseDownResizeManipulator">
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, Ref, toRefs, reactive, computed, inject, watchEffect } from 'vue'
    import { Point } from '@/defines/types/point'
    import { Size } from '@/defines/types/size'
    import { MouseButton } from '@/defines/mouse'
    import { useStore, Stores } from '@/stores'
    import { ControlState } from '@/defines/types/control'
    import { EmptyEntryId, EditorNodeModel, FactoryModel } from '@/defines/types/editor_model'
    import { selectView } from '@/defines/view'
    import RecipeView from '@/components/Editor/RecipeView.vue'

    // 使用する Awesome Font のアイコンを登録
    import { library } from '@fortawesome/fontawesome-svg-core';
    //import { barsfilter, faWrench } from "@fortawesome/free-solid-svg-icons";
    //library.add(faReplyAll);
    //library.add(faWrench);

    /** フレームの最小サイズ */
    const MinFrameWidth = 210;
    /** フレームの最小サイズ */
    const MinFrameHeight = 24;

    /** プロパティを定義 */
    const Props = {
        /** エントリID */
        entryId: {
            type: String,
            default: EmptyEntryId,
        },
    };

    /** 内部で扱うメンバ変数を定義 */
    interface Data {
        /** ストア */
        stores: Stores;
        /** 前回のクライアント領域上の位置 */
        prevClientPos: Point,
    };

    /** テンプレート参照する定義 */
    interface Refs {
        frame: Ref<HTMLElement|null>,
        innerArea: Ref<HTMLElement|null>
    }

    export default defineComponent({
        name: 'factory-view',
        components: {
            RecipeView,
        },
        props: Props,
        setup(props) {
            const state = reactive<Data>({
                stores: useStore(),
                prevClientPos: new Point(),
            });
            const refs: Refs = {
                frame: ref(null),
                innerArea: ref(null),
            };
            watchEffect(() => {
                console.log(refs.frame.value);
            });

            // computes 内から参照される computed を一旦外に定義
            const entry = computed((): EditorNodeModel|undefined => {
                return state.stores.canvas.getEntryById(props.entryId);
            });
            /** 表示位置 */
            const factoryPoint = computed((): Point => {
                return (entry.value) ? (entry.value.data as FactoryModel).position : new Point();
            });
            /** フレームサイズ */
            const factorySize = computed((): Size => {
                return (entry.value) ? (entry.value.data as FactoryModel).frameSize : new Size();
            });

            // computed
            // this の代わりに state
            const computes = {
                /** 対象のエントリ取得 */
                entry: entry,
                /** 表示位置 */
                factoryPoint: factoryPoint,
                /** フレームサイズ */
                factorySize: factorySize,
                /** 工場（エリア）名 */
                factoryName: computed((): string => {
                    return (entry.value) ? (entry.value.data as FactoryModel).factoryName : '';
                }),
                // フレームに適用するスタイル
                frameStyle: computed(() => {
                    if (!entry.value || !entry.value.data) return {};
                    return {
                        left: factoryPoint.value.x + 'px',
                        top: factoryPoint.value.y + 'px',
                        width: factorySize.value.width + 'px',
                        height: factorySize.value.height + 'px',
                    }
                }),
                /** 製造しているレシピリスト */
                productions: computed(() => {
                    return (entry.value) ? entry.value.childEntryIds : [];
                }),
            };

            // methods
            // this の代わりに state
            const methods = {
                selectView: (entryId: string) => {
                    return selectView(entryId, state.stores);
                }
            };

            // 操作系
            const manipulators = {
                // リサイズ操作
                onMouseDownResizeManipulator: (e:MouseEvent) => {
                    // 左ボタンでリサイズ開始
                    if (e.button == MouseButton.Left) {
                        if (state.stores.control.status != ControlState.Idling) return;
                        state.stores.control.setStatus(ControlState.ResizingNode);
                        state.prevClientPos.x = e.clientX;
                        state.prevClientPos.y = e.clientY;
                        const entryId = props.entryId;
                        // 移動と終了はコンテンツ外になることがあるのでイベント登録
                        const mousemove = (e: MouseEvent) => {
                            if (state.stores.control.status == ControlState.ResizingNode) {
                                const diffX = e.clientX - state.prevClientPos.x;
                                const diffY = e.clientY - state.prevClientPos.y;
                                const model = (entry.value?.data as FactoryModel);
                                if (model) {
                                    model.frameSize.width += diffX;
                                    model.frameSize.height += diffY;
                                    if (model.frameSize.width < MinFrameWidth)
                                        model.frameSize.width = MinFrameWidth;
                                    if (model.frameSize.height < MinFrameHeight)
                                        model.frameSize.height = MinFrameHeight;
                                    state.stores.canvas.setFactoryModel(entryId, model);
                                    state.prevClientPos.set(e.clientX, e.clientY);
                                }
                            }
                        }
                        const mouseup = (e: MouseEvent) => {
                            if (state.stores.control.status == ControlState.ResizingNode) {
                                if (e.button == MouseButton.Left) {
                                    state.stores.control.setStatus(ControlState.Idling);
                                    window.removeEventListener('mousemove', mousemove);
                                    window.removeEventListener('mouseup', mouseup);
                                }
                            }
                        }
                        window.addEventListener('mousemove', mousemove);
                        window.addEventListener('mouseup', mouseup);
                    }
                },
            };

            return {
                ...props,
                ...toRefs(state),
                ...refs,
                ...computes,
                ...methods,
                ...manipulators,
            };
        },
    });
</script>

<style scoped>
    .factory-view-frame {
        position: absolute;
        border: 1px solid black;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
    }
    .factory-name {
        font-weight: bold;
        text-align: center;
    }
    .factory-in {
        flex: 1;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-start;
        position: relative;
        padding: 8px;
    }

    .resize-manipulator {
        position: absolute;
        right: 0px;
        bottom: 0px;
        width: 16px;
        height: 16px;
        background: black;
        overflow: hidden;
    }
    .resize-manipulator:hover {
        cursor:se-resize;
    }
</style>