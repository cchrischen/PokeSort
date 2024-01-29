<script setup lang="ts">
    import { pokemonData } from "../util/Game";
    import { computed, ref } from "vue";

    const props=defineProps({
        dex: String,
        enabled: Boolean,
        category: Number,
        stat: Number,
        order: Number
    })

    const dex = computed(() => props.dex ? props.dex : "1-0");

    const pokedata = ref(pokemonData[dex.value])
    const sprite = ref(pokedata.value.sprite ?? "")

    const cursorStatus = computed(() => props.enabled ? {"cursor": "move"} : {"cursor": "default"})
</script>

<template>
    <div class="box" :style="cursorStatus">
        <p class="orderNum" style="font-size: 1em; font-weight: bold;">
            {{ (order ?? -1) + 1 }}
        </p>
        <img :src="sprite" height="125px" width="125px">
        <div v-if="!enabled" class="soln-info">
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
    margin: 20px 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 25px;
    border-radius: 20px;
    border-radius: 20px;
    background: #f0f8ff;
    box-shadow: 10px 10px 20px #868b8f,
                -10px -10px 20px #ffffff;
}

.soln-info {
    display: inherit;
    flex-direction: inherit;
    align-items: inherit;
}

p, h1, h2 {
    font-size: 20px;
    margin: 0;
}

</style>