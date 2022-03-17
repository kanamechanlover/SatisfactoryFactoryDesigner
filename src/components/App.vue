<template>
    <MainView></MainView>
</template>

<script lang="ts">
import MainView from '@/components/MainView.vue'
import { defineComponent, provide, computed, reactive, toRefs } from 'vue'
import { initStore } from '@/stores'
import { Tooltip } from "bootstrap";


export default defineComponent({
    components: {
        MainView,
    },
    setup() {
        // ストア初期化
        initStore();

        // Bootstrap の Tooltip を使えるようにする
        new Tooltip(document.body, {
            selector: "[data-bs-toggle='tooltip']",
        });

        // デフォルトのコンテキストメニューを無効化
        document.addEventListener('contextmenu', (event) => { event.preventDefault(); })
    },
});

</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
}

html,body {
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    overflow: none;
    user-select: none;
}

* {
    box-sizing: border-box;
}

</style>
