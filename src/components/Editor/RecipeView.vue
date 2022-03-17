<template>
    <div class="recipe-view-frame" ref="frame" data-type="RecipeView" data-draggable>
        <div class="layout">
            <div class="machine">
                <img :src="imageUrl(machineId)"
                    data-bs-toggle="tooltip"
                    :title="'設備名：' + machineName" />
            </div>
            <div class="recipe-name"
                    data-bs-toggle="tooltip"
                    :title="'レシピ名：' + recipeName"
            >
                <div class="recipe-name-inner" ref="recipeNameArea">
                    <!-- レシピ名の横幅を加味せず横幅オーバー分を省略表示するように -->
                    <div class="recipe-name-hover" :style="recipeNameStyle">
                        {{ recipeName }}
                    </div>
                    &nbsp; <!-- 高さは確保したいので空白を入れる -->
                </div>
            </div>
            <div class="recipe-row">
                <div v-for="(material, index) in inputListKeyValue"
                        :key="material.key" class="input-material">
                    <div class="material-icon" :class="{
                        'material-state-solid': stores.config.isSolidMaterial(material.key),
                        'material-state-fluid': stores.config.isFluidMaterial(material.key),
                        'material-state-gas': stores.config.isGasMaterial(material.key),
                    }">
                        <img :src="imageUrl(material.key)"
                            data-bs-toggle="tooltip"
                            :title="'入力' + (index + 1) + '：' + stores.config.materialName(material.key)" />
                    </div>
                    <div class="material-number"
                        data-bs-toggle="tooltip"
                        :title="adjustedNeeds(material.value) + stores.config.materialUnit(material.key) + '/分'"
                    >
                        {{ adjustedNeeds(material.value) }}
                    </div>
                </div>
                <div class="exchange-arrow">
                    <div class="inner-exchange-arrow">
                        <FontAwesome :icon="['fas', 'angle-right']" size="2x" />
                        <div>分間</div>
                    </div>
                </div>
                <div v-for="(material, index) in outputListKeyValue" class="output-material" :key="material.key">
                    <div class="material-icon">
                        <img :src="imageUrl(material.key)"
                            data-bs-toggle="tooltip"
                            :title="'出力' + (index + 1) + '：' + stores.config.materialName(material.key)" />
                    </div>
                    <div class="material-number"
                        data-bs-toggle="tooltip"
                        :title="adjustedNeeds(material.value) + stores.config.materialUnit(material.key) + '/分'"
                    >
                        {{ adjustedNeeds(material.value) }}
                    </div>
                </div>
            </div>
            <div class="footer">
                <div class="overclock" :class="overclockColor"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="オーバークロック数"
                >
                    <FontAwesome :icon="['fas', 'reply-all']" rotation="90" />
                    {{ overclock }}%
                </div>
                <div class="machine-number" :class="multiMachineColor"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="設備台数"
                >
                    <FontAwesome :icon="['fas', 'wrench']" />
                    x {{ machineNumber }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        Ref,
        toRefs,
        reactive,
        computed,
        onMounted,
        onUpdated
    } from 'vue'
    import { useStore, Stores } from '@/stores'
    import { EditorNodeModel, RecipeModel } from '@/defines/types/editor_model'

    // 使用する Awesome Font のアイコンを登録
    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faReplyAll, faWrench } from "@fortawesome/free-solid-svg-icons";
    library.add(faReplyAll);
    library.add(faWrench);

    /** プロパティを定義 */
    const Props = {
        /** エントリID */
        entryId: {
            type: String,
            default: '-1',
        },
    };

    /** 内部で扱うメンバ変数を定義 */
    interface Data {
        /** ストア */
        stores: Stores,
    };

    /** テンプレート参照する定義 */
    interface Refs {
        frame: Ref<HTMLElement|null>,
        recipeNameArea: Ref<HTMLElement|null>,
    }

    export default defineComponent({
        name: 'recipe-view',
        props: Props,
        setup(props) {
            const state = reactive<Data>({
                stores: useStore(),
            });

            const refs: Refs = {
                frame: ref(null),
                recipeNameArea: ref(null),
            };

            // computes 内から参照される computed を一旦外に定義
            const entry = computed((): EditorNodeModel|undefined => {
                return state.stores.canvas.getEntryById(props.entryId);
            });
            /** レシピ名 */
            const recipeName = computed((): string => {
                return (entry.value?.data as RecipeModel).recipeName;
            });
            /** レシピを使用可能な設備ID */
            const machineId = computed((): string => {
                return state.stores.config.machineIdForRecipe(recipeName.value);
            });
            /** 設備台数 */
            const machineNumber = computed((): number => {
                return (entry.value?.data as RecipeModel).number;
            });
            /** オーバークロック数 */
            const overclock = computed((): number => {
                return (entry.value?.data as RecipeModel).overclock;
            });
            /** 設備ID */
            const machineName = computed((): string => {
                return state.stores.config.machineName(machineId.value);
            });
            /** レシピの入力素材リスト */
            const inputList = computed((): any => {
                return state.stores.config.recipeInput(recipeName.value);
            });
            /** レシピの出力素材リスト */
            const outputList = computed((): any => {
                return state.stores.config.recipeOutput(recipeName.value);
            });

            // computed
            const computes = {
                /** レシピ名 */
                recipeName: recipeName,
                /** レシピを使用可能な設備ID */
                machineId: machineId,
                /** 設備台数 */
                machineNumber: machineNumber,
                /** オーバークロック数 */
                overclock: overclock,
                /** 設備ID */
                machineName: machineName,
                /** レシピの入力素材リスト */
                inputList: inputList,
                /** レシピの出力素材リスト */
                outputList: outputList,

                /** 実際のレシピ名表示エリアに適用するスタイル取得 */
                recipeNameStyle: computed(() => {
                    const el = refs.recipeNameArea.value;
                    if (!el) {
                        return {
                            width: '100px',
                            height: '1px'
                        };
                    }
                    return {
                        width: el.clientWidth + 'px',
                        height: el.clientHeight + 'px',
                    };
                }),
                /** 入力素材リストを KeyValue 配列に変換 */
                inputListKeyValue: computed(() => {
                    return Object.keys(inputList.value).map((key) => {
                        return {
                            key: key,
                            value: inputList.value[key],
                        };
                    });
                }),
                /** 出力素材リストを KeyValue 配列に変換 */
                outputListKeyValue: computed(() => {
                    return Object.keys(outputList.value).map((key) => {
                        return {
                            key: key,
                            value: outputList.value[key],
                        };
                    });
                }),
                /** オーバークロック色 */
                overclockColor: computed((): string => {
                    // 100% 未満なら青
                    if (overclock.value < 100) {
                        return 'clockdown';
                    }
                    // 201 - 250%
                    else if (overclock.value > 200) {
                        return 'clockup3';
                    }
                    // 151 - 200%
                    else if (overclock.value > 150) {
                        return 'clockup2';
                    }
                    // 101 - 150%
                    else if (overclock.value > 100) {
                        return 'clockup1';
                    }
                    return '';
                }),
                /** 設備複数台時の色 */
                multiMachineColor: computed((): string => {
                    if (machineNumber.value > 1) {
                        return 'multi-machine';
                    }
                    return '';
                }),
                
            };
    
            // methods
            // this の代わりに state
            const methods = {
                /** 初期化 */
                initialize:() => {
                    console.log('initialize RecipeView by "' + recipeName + '"');
                    const model: EditorNodeModel|undefined = state.stores.canvas.getEntryById(props.entryId);
                    if (!model) return; // エントリIDが一致しなければ何もできない。

                },
                /** 画像 src */
                imageUrl: (name: string): string => {
                    return './src/assets/icons/materials/' + name + '.png';
                },
                /** オーバークロック数と台数を加味した分間量 */
                adjustedNeeds: (base: number): number => {
                    return base * (overclock.value / 100.0) * machineNumber.value;
                },
                /** 右クリックされたらコンテキストメニューを出す */
                oncontextmenu: (e: any) => {
                    if (!('recipeMenu' in refs)) return;
                    console.log(document.querySelector('#recipe-view-contextmenu'));
                },
            };

            // マウント時に初期化
            onMounted(() => {
                methods.initialize();
            });
    
            return {
                ...toRefs(props),
                ...toRefs(state),
                ...refs,
                ...computes,
                ...methods,
            };
        },
    });
</script>

<style scoped>
    .recipe-view-frame {
        margin: 0px;
        padding: 8px;
        border: 2px solid gray;
        border-radius: 8px;
        white-space: nowrap;
        background: #333333;
    }
    .layout {
        display: flex;
        flex-direction: column;
        position: relative;
    }
    .layout > div:not(:last-child) {
        margin-bottom: 8px;
    }
    .machine {
        position: absolute;
        top: -14px;
    }
    .machine > img {
        width: 40px;
        height: 40px;
        border: 2px solid dimgray;
        border-radius: 8px;
    }
    .recipe-name {
        display: flex;
        flex-direction:column;
        align-items: left;
        margin-left: 48px;
        background: dimgray;
        border-radius: 8px;
        padding-top: 2px;
        text-align: left;
    }
    .recipe-name-inner {
        position: relative; /* 実際の文字列はこの位置に配置 */
        color: silver;
        font-weight: bold;
        margin-left: 8px;
        margin-right: 8px;
    }
    /* 実際のレシピ名表示エリア（サイズ計算に含ませないために浮かせる） */
    .recipe-name-hover {
        position: absolute;
        width: 100px;
        /*height: 1px;*/
        overflow:hidden;
        text-overflow: ellipsis;
    }
    .recipe-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-weight: bold;
    }
    .recipe-row > div:not(:last-child) {
        margin-right: 8px;
    }
    .material-icon {
        margin-bottom: 8px;
    }
    .material-icon img {
        width: 40px;
        height: 40px;
        border: 1px solid gray;
    }
    .material-state-solid {
        border-radius: 0px;
    }
    .material-state-fluid {
        border-radius: 40px;
    }
    .material-state-gas {
        border-radius: 40px;
    }
    .material-number {
        background: dimgray;
        border-radius: 8px;
        padding-top: 2px;
        color: silver;
    }
    .exchange-arrow {
        display: flex;
        flex-direction: row;
        justify-content: center;
        color: gray;
    }
    .inner-exchange-arrow {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .footer {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .footer div:not(:last-child) {
        margin-right: 8px;
    }
    .overclock {
        flex: 1;
        background: dimgray;
        /*border: 1px solid silver;*/
        border-radius: 8px;
        color: silver;
        padding-top: 2px;
        padding-left: 8px;
        padding-right: 8px;
    }
    .clockdown {
        color: lightskyblue; /* 50% */
    }
    .clockup1 {
        color: gold; /* 150% */
    }
    .clockup2 {
        color: orange; /* 200% */
    }
    .clockup3 {
        color: tomato; /* 250% */
    }
    .machine-number {
        flex: 1;
        background: dimgray;
        /*border: 1px solid silver;*/
        border-radius: 8px;
        color: silver;
        padding-top: 2px;
        padding-left: 8px;
        padding-right: 8px;
    }
    .multi-machine {
        color: orange; /* 2以上 */
    }
</style>