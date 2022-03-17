<template>
    <div class="layout-menu">
        <div class="menu-area">
            <div class="menu-left">Satisfactory Layout Designer<br /><small>開発中 v0.0.1</small></div>
            <div class="menu-center">Menu Area</div>
            <div class="menu-right">ControlState: {{ stores.control.status }}</div>
            
        </div>
        <div class="contents-area">
            <EditorView ref="editor"></EditorView>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, reactive, toRefs } from 'vue'
    import EditorView from '@/components/Editor/EditorView.vue'
    import { useStore, Stores } from '@/stores'

    interface Data {
        stores: Stores,
    }

    export default defineComponent({
        name: 'main-view',
        components: {
            EditorView,
        },
        setup() {
            const state = reactive<Data>({
                stores: useStore(),
            })
            // クライアント領域のカーソル位置をストアに反映
            window.addEventListener('mousemove', (e) => {
                state.stores.control.setClientPos(e.clientX, e.clientY);
            });

            return {
                ...toRefs(state),
            }
        }
    });
</script>

<style scoped>
.layout-menu {
    margin: 0px;
    display: flex;
    flex-direction: column;
    height: 100%;
}
.menu-area {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: orange;
    height: 32px;
    border-bottom: 1px solid darkorange;
    overflow: hidden;
}
.menu-left {
    width: 200px;
    font-size: 0.8em;
    line-height: 1em;
    font-weight: bold;
}
.menu-left > small{
    color: white;
    background: tomato;
    padding: 2px 8px;
    border-radius: 8px;
}
.menu-center {
    flex: 1;
    border-left: 1px solid black;
    border-right: 1px solid black;
}
.menu-right {
    width: 200px;
    text-align: left;
    padding-left: 8px;
}
.contents-area {
    flex: 1;
    background: whitesmoke;
}
</style>