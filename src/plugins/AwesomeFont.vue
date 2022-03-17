<script setup lang="ts">
    import { computed, defineProps } from "vue";
    import { findIconDefinition, IconName, IconPrefix } from "@fortawesome/fontawesome-svg-core";

    const props = defineProps({
        icon: {
            type: IconName,
            required: true
        },
        type: {
            type: IconPrefix,
            default: "fas",
            required: false
        },
        class: String
    });

    const definition = computed(() =>
      findIconDefinition({
        prefix: props.type,
        iconName: props.icon
      })
    );
 
    const width = computed(() => definition.value.icon[0]);
    const height = computed(() => definition.value.icon[1]);
    const svgPath = computed(() => definition.value.icon[4]);
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :class="$props.class"
    :viewBox="`0 0 ${width} ${height}`"
  >
    <path fill="currentColor" :d="svgPath" />
  </svg>
</template>