<script setup lang="ts">
import PokeCard from "./PokeCard.vue"
import { ref } from "vue";
import draggable from "vuedraggable";
import pokemon from "../util/Pokemon.json"
import { rng } from "../util/util";
import { gameCategories, statChoices, get6Pokemon, getNameChain, getTypeChain } from "../util/Game";

const currentMons = ref<{name:string}[]>([]);

const getNewGame = (select: number) => {
    let foo;

    if (select == 0) {
        foo = get6Pokemon();
    } else {
        foo = getNameChain();
    }

    currentMons.value = foo;
}

const enabled = ref<boolean>(true);

const foo = () => console.log(currentMons.value);

getNewGame(0);
</script>

<template>
    <div class="container">
        <div class="desc">
            <h1>Sort by:</h1>
            <h2>Increasing national dex number</h2>
        </div>
        <div class="order">
            <draggable
                :list="currentMons"
                :disabled="!enabled"
                class="draggableRow"
                item-key="name"
                ghost-class="ghost"
            >
                <template #item="{ element }">
                    <PokeCard :dex="element.name" :enabled="enabled"/>
                </template>
            </draggable>
        </div>
        <div class = "control">
            <button @click="getNewGame(0)">
                Give Up
            </button>
            <button @click="getTypeChain">
                Check
            </button>
            <button @click="getNewGame(1)">
                New Game
            </button>
        </div>
    </div>
</template>

<style>
.container{
    display: flex;
    flex-direction: column;
    height: calc(100vh - 85.6px);
    margin: 0px 20px;
}

.desc{
    text-align: center;
}

.order {
    background-color: aliceblue;
    height: 15em;
    margin-top: 30px;
    padding: 0px 20px;
    border-radius: 10px;
}

.draggableRow {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    height: 100%;
}

.control {
    margin-top: 30px;
    display: flex;
    justify-content: space-evenly;
}

</style>