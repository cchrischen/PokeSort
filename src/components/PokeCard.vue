<script setup lang="ts">
    import { pokemonData } from "../util/Game";
    import { computed, ref } from "vue";

    const props=defineProps({
        dex: String,
        enabled: Boolean,
        category: Number,
        stat: Number
    })

    const dex = computed(() => props.dex ? props.dex : "1-0");

    const pokedata = ref(pokemonData[dex.value])
    const sprite = ref(pokedata.value.sprite ?? "")

    const cursorStatus = computed(() => props.enabled ? {"cursor": "move"} : {"cursor": "default"})
</script>

<template>
    <div class="box" :style="cursorStatus">
        <img :src="sprite" height="125px" width="125px">
        <div v-if="!enabled">
            <h1>
                {{ pokemonData[dex].name }}
            </h1>

            <h2 v-if="category == 0">
                {{ pokemonData[dex].dex }}
            </h2>
            <h2 v-else-if="category == 1">
                {{ pokemonData[dex].stats[stat ?? 0] }}
            </h2>
            <h2 v-else-if="category == 2">
                {{ pokemonData[dex].types }}
            </h2>
        </div>
    </div>
</template>

<style>
.box {
    width: 10em;
    min-height: 10em;
    padding: 10px;
    display: flex;
    flex-direction: column;
}

</style>