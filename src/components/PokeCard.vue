<script setup lang="ts">
    import pokemon from "../util/Pokemon.json";
    import { ref } from "vue";

    const props=defineProps({
        dex: String,
        enabled: Boolean
    })

    const pokedata = ref(pokemon[props.dex as keyof typeof pokemon])
    const sprite = ref(pokedata.value.sprite ?? "")

    const cursorStatus = ref({cursor: props.enabled ? "move" : "pointer"})
</script>

<template>
    <div class="box" :style="cursorStatus">
        <img :src="sprite">
    </div>
</template>

<style>
.box {
    width: 10em;
    height: 10em;
    padding: 10px;
    display: flex;
    flex-direction: column;
}

</style>