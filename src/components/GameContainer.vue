<script setup lang="ts">
import PokeCard from "./PokeCard.vue"
import { ref } from "vue";
import draggable from "vuedraggable";
import { rng, sleep } from "../util/util";
import { gameCategories, statChoices, get6Pokemon, getNameChain, getTypeChain, checkWin } from "../util/Game";

const currentMons = ref<{name:string}[]>([]);
const solution = ref<string[]>([]);

const getNewGame = () => {
    let newMons;
    let soln;
    stat.value = undefined;
    statIdx.value = undefined;
    gameState.value = 0;
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
    if (checkWin(currentMons.value, category.value, statIdx.value ?? -1)) {
        showSolution();
    } else {
        gameState.value = -1;
    }
}

const showSolution = async () => {
    gameState.value = 1;
    await sleep(100);
    enabled.value = false;
    currentMons.value = solution.value.map((el) =>{return {name: el}});
}

const handleChange = (event: any) => {
    category.value = parseInt(event.target.value);
    getNewGame();
};

const enabled = ref<boolean>(true);
const category = ref<number>(0);
const stat = ref<string|undefined>(undefined);
const statIdx = ref<number|undefined>(undefined);
const gameState = ref<number>(0);

const dragOptions = ref({
  animation: 100,
  group: 'description',
  ghostClass: 'ghost',
  dragClass: 'dragMon'
});

getNewGame();
</script>

<template>
    <div id="container">
        <div class="desc">
            <h1 id="title">Sort by:</h1>
            <select @change="handleChange($event)">
                <option v-for="category in gameCategories" :key="category.id" :value="category.id">
                    {{ category.title }}
                </option>
            </select>
            <h3 v-if="stat">{{ stat }}</h3>
        </div>

        <div v-if="gameState != 1" class="order">
            <draggable
            class="draggableRow"
            :list="currentMons"
            item-key="name"
            v-bind="dragOptions"
            >
                <template #item="{ element }" >
                    <PokeCard :dex="element.name" :enabled="enabled" :category="category" :stat="statIdx" :order="currentMons.indexOf(element)"/>
                </template>
            </draggable>
        </div>
        <div v-else class="order draggableRow">
            <TransitionGroup name="list">
                <PokeCard v-for="element in currentMons" :key="element.name" :dex="element.name" :enabled="enabled" :category="category" :stat="statIdx" :order="currentMons.indexOf(element)"/>
            </TransitionGroup>
        </div>

        <div class = "control">
            <button @click="showSolution" class="btn">
                Give Up
            </button>
            <button @click="checkAnswer" class="btn">
                Check
            </button>
            <button @click="getNewGame" class="btn">
                New Game
            </button>
        </div>
    </div>
</template>

<style>
#container{
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 125.6px);
    height: auto;
    padding: 20px;
    background-color: #f0f8ff;
    font-family: 'Courier New', Courier, monospace;
}

#title {
    font-size: 3em;
    margin: 0 0 10px 0;
}

.desc{
    text-align: center;
}

.order {
    margin-top: 30px;
    padding: 30px 20px;
    border-radius: 20px;
}

.draggableRow {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap:wrap;
}

.control {
    margin-top: 30px;
    display: flex;
    justify-content: space-evenly;
    font-family: inherit;
}

.dragMon{
    opacity: 0.5;
    background-color: transparent;
    box-shadow: none;
    font-size: 0;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}

.btn {
    font-size: 2em;
    font-family: 'Courier New', Courier, monospace;
    padding: 10px;
    text-transform: uppercase;
    background: #f0f8ff;
    border-radius: 50px;
    border: none;
    background: #f0f8ff;
    box-shadow:  10px 10px 20px #868b8f,
             -10px -10px 20px #ffffff;
}

.btn:hover {
    background: #badfff;
}

h3 {
    margin: 10px 0 0 0;
    font-size: 2em;
}

select {
    font-family: 'Courier New', Courier, monospace;
    font-size: 2em;
    border-radius: 20px;
    padding: 10px 20px;
    border-radius: 20px;
    border: none;
    background: #f0f8ff;
    box-shadow:  inset 7px 7px 14px #b2b8bd,
            inset -7px -7px 14px #ffffff;
}

</style>