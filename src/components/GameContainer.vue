<script setup lang="ts">
import PokeCard from "./PokeCard.vue"
import { computed, ref } from "vue";
import draggable from "vuedraggable";
import { rng } from "../util/util";
import { gameCategories, statChoices, get6Pokemon, getNameChain, getTypeChain, checkWin } from "../util/Game";

const currentMons = ref<{name:string}[]>([]);
const solution = ref<string[]>([]);

const getNewGame = () => {
    let newMons;
    let soln;
    stat.value = undefined;
    statIdx.value = undefined;
    win.value = undefined;
    enabled.value = true;

    if (category.value == 0) {
        [soln, newMons] = get6Pokemon(-1);
    } else if (category.value == 1) {
        statIdx.value = rng(0, statChoices.length - 1);
        [soln, newMons] = get6Pokemon(statIdx.value);
        stat.value = statChoices[statIdx.value];
    } else if (category.value == 2) {
        [soln, newMons] = getTypeChain();
    } else {
        [soln, newMons] = getNameChain();
    }

    currentMons.value = newMons;
    solution.value = soln;
}

const checkAnswer = () => {
    win.value = checkWin(currentMons.value, category.value, statIdx.value ?? -1);
}

const showSolution = () => {
    enabled.value = false;
    currentMons.value = solution.value.map((el) =>{return {name: el}});
    win.value = true;
}

const handleChange = (event: any) => {
    category.value = parseInt(event.target.value);
    getNewGame();
};

const enabled = ref<boolean>(true);
const category = ref<number>(0);
const stat = ref<string|undefined>(undefined);
const statIdx = ref<number|undefined>(undefined);
const win = ref<boolean|undefined>(undefined);

getNewGame();
</script>

<template>
    <div id="container">
        <div class="desc">
            <h1>Sort by:</h1>
            <select @change="handleChange($event)">
                <option v-for="category in gameCategories" :key="category.id" :value="category.id">
                    {{ category.title }}
                </option>
            </select>
            <h3 v-if="stat">{{ stat }}</h3>
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
                    <PokeCard :dex="element.name" :enabled="enabled" :category="category" :stat="statIdx"/>
                </template>
            </draggable>
        </div>
        <div>
            {{ win }}
        </div>
        <div class = "control">
            <button @click="showSolution">
                Give Up
            </button>
            <button @click="checkAnswer">
                Check
            </button>
            <button @click="getNewGame">
                New Game
            </button>
        </div>
    </div>
</template>

<style>
#container{
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
    min-height: 15em;
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