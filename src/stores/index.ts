import { provide, inject, computed, reactive } from 'vue'
import { CanvasStore, canvasStore } from '@/stores/canvas'
import { ConfigStore, configStore } from '@/stores/config'
import { ControlStore, controlStore } from '@/stores/control'

export interface Stores {
    canvas: CanvasStore;
    config: ConfigStore;
    control: ControlStore;
};

// ストア管理
export const initStore = () => {
    const state = reactive<Stores>({
        canvas: canvasStore(),
        config: configStore(),
        control: controlStore(),
    });

    provide('canvas', computed(() => state.canvas));
    provide('config', computed(() => state.config));
    provide('control', computed(() => state.control));
};

// ストア使う側の参照
export const useStore = ():Stores => {
    return {
        canvas: inject<CanvasStore>('canvas'),
        config: inject<ConfigStore>('config'),
        control: inject<ControlStore>('control'),
    } as Stores;
};