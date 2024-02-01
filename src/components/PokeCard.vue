<script setup lang="ts">
    import * as TypesJSON from "../util/Types.json";
    import { pokemonData } from "../util/Game";
    import { computed, ref } from "vue";

    const props=defineProps({
        dex: String,
        enabled: Boolean,
        category: Number,
        stat: Number,
        order: Number
    })

    const TypeData: any = TypesJSON;

    const dex = computed(() => props.dex ? props.dex : "1-0");
    const types = computed<string[]>(() => pokemonData[dex.value].types);

    const pokedata = ref(pokemonData[dex.value])
    const sprite = ref(pokedata.value.sprite ?? "")

    const cursorStatus = computed(() => props.enabled ? {"cursor": "move"} : {"cursor": "default"});
</script>

<template>
    <div class="box" :style="cursorStatus">
        <p class="orderNum" style="font-size: 1em; font-weight: bold;">
            {{ (order ?? -1) + 1 }}
        </p>
        <img :src="sprite" height="125px" width="125px">
        <div v-if="!enabled" class="soln-info">
            <h1 class="name">
                {{ pokemonData[dex].name }}
            </h1>

            <h2 v-if="category == 0" class="extrainfo">
                {{ pokemonData[dex].dex }}
            </h2>
            <h2 v-else-if="category == 1" class="extrainfo">
                {{ pokemonData[dex].stats[stat ?? 0] }}
            </h2>
            <h2 v-else-if="category == 2" class="extrainfo">
                <img class="type" v-for="t in types" :key="t" :src="TypeData[t].icon" height="40px" weight="40px">
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

.type {
    margin: 0px 5px;
}

.name {
    margin: 0;
    font-size:1.4em;
}

.extrainfo {
    margin: 0;
    font-size: 1.25em;
}

</style>