import { ref, reactive } from 'vue'
import {
    Config,
    MaterialState,
    MaterialStateUnit,
    ConfigRecipe,
    MateriStateUnitType,
} from '@/defines/types/config';
import ConfigData from '@/assets/config/config.json'

export function configStore() {
    const state = reactive(new Config());
    state.deserialize(ConfigData);
    const getRecipe = (recipeName: string): ConfigRecipe | undefined => {
        return state.recipes.find((v) => v.name == recipeName);
    };
    return {
        /** 資源素材リストを取得 */
        get resources() {
            return state.resources;
        },
        /**
         * 設備名取得
         * @param id 設備ID
         * @returns 設備名
         */
        machineName(id: string): string {
            if (!(id in state.machines)) return '';
            return state.machines[id].name;
        },
        /**
         * 素材名取得
         * @param id 素材ID
         * @returns 素材名
         */
        materialName(id: string): string {
            if (!(id in state.materials)) return '';
            return state.materials[id].name;
        },
        /**
         * 素材の状態を取得
         * @param id 素材ID
         * @returns Solid | Fluid | Gas 無ければ 空文字列
         */
        materialState(id: string): MaterialState | '' {
            if (!(id in state.materials)) return '';
            return state.materials[id].state;
        },
        /**
         * 固体素材か
         * @param id 素材ID
         * @returns true: 固体素材、false それ以外または素材IDが無い
         */
        isSolidMaterial(id: string): boolean {
            if (!(id in state.materials)) return false;
            return state.materials[id].state == 'Solid';
        },
        /**
         * 液体素材か
         * @param id 素材ID
         * @returns true: 液体素材、false それ以外または素材IDが無い
         */
        isFluidMaterial(id: string): boolean {
            if (!(id in state.materials)) return false;
            return state.materials[id].state == 'Fluid';
        },
        /**
         * 気体素材か
         * @param id 素材ID
         * @returns true: 気体素材、false それ以外または素材IDが無い
         */
        isGasMaterial(id: string): boolean {
            if (!(id in state.materials)) return false;
            return state.materials[id].state == 'Gas';
        },
        /**
         * 素材の単位を取得
         * @param id 素材ID
         * @returns 素材の単位（'個' | '㎥'）、素材IDが無ければ空文字列
         */
        materialUnit(id: string): string {
            if (!(id in state.materials)) return '';
            const materialState = state.materials[id].state as MateriStateUnitType;
            return MaterialStateUnit[materialState];
        },
        /**
         * レシピを使用可能な設備IDを取得
         * @param recipeName レシピ名
         * @returns レシピを使用可能な設備ID
         */
        machineIdForRecipe(recipeName: string): string {
            const recipe = getRecipe(recipeName);
            if (recipe === undefined) return '';
            return recipe.machine[0];
        },
        /**
         * レシピの入力素材リスト取得
         * @param recipeName レシピ名
         * @returns レシピの入力素材リスト key=素材ID、value=必要数
         */
        recipeInput(recipeName: string): any {
            const recipe = getRecipe(recipeName);
            if (recipe === undefined) return {};
            return recipe.input;
        },
        /**
         * レシピの出力素材リスト取得
         * @param recipeName レシピ名
         * @returns レシピの出力素材リスト key=素材ID、value=必要数
         */
        recipeOutput(recipeName: string): any {
            const recipe = getRecipe(recipeName);
            if (recipe === undefined) return {};
            return recipe.output;
        }
    };
}
export type ConfigStore = ReturnType<typeof configStore>;