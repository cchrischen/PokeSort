<script setup lang="ts">
import { ref } from "vue";
import draggable from "vuedraggable";

import PokeCard from "./PokeCard.vue";
import TimeDisplay from "./TimeDisplay.vue";

import {
  checkWin,
  gameCategories,
  get6Pokemon,
  getNameChain,
  getTypeChain,
  statChoices,
} from "../util/Game";
import { rng, sleep } from "../util/util";

const currentMons = ref<{ name: string }[]>([]);
const solution = ref<string[]>([]);

const enabled = ref<boolean>(true);
const category = ref<number>(0);
const stat = ref<string | undefined>(undefined);
const statIdx = ref<number | undefined>(undefined);

const startTime = ref<number>(new Date().valueOf());
const elapsedTime = ref<number>(-1);
const avgTime = ref<number>(-1);
const bestTime = ref<number>(-1);
const repetitions = ref<number>(0);

const getNewGame = () => {
  let newMons;
  let soln;
  stat.value = undefined;
  statIdx.value = undefined;
  enabled.value = true;

  startTime.value = new Date().valueOf();

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
};

const checkAnswer = async () => {
  let cards = document.getElementsByClassName("box")!;
  if (checkWin(currentMons.value, category.value, statIdx.value ?? -1)) {
    if (enabled.value) {
      elapsedTime.value = new Date().valueOf() - startTime.value;
      avgTime.value =
        (repetitions.value * avgTime.value + elapsedTime.value) /
        (repetitions.value + 1);
      repetitions.value++;
      bestTime.value =
        bestTime.value == -1 || elapsedTime.value < bestTime.value
          ? elapsedTime.value
          : bestTime.value;
    }

    enabled.value = false;
    await sleep(50);
    cards = document.getElementsByClassName("box")!;

    for (let i = 0; i < cards.length; i++) {
      console.log(cards[i]);
      cards[i].animate(
        [
          { transform: "translateY(0px)" },
          { transform: "translateY(-10px)" },
          { transform: "translateY(-15px)" },
          { transform: "translateY(-10px)" },
          { transform: "translateY(0px)" },
        ],
        {
          duration: 400,
          iterations: 1,
        }
      );
      await sleep(100);
    }
  } else {
    for (let i = 0; i < cards.length; i++) {
      cards[i].animate(
        [
          { transform: "translateX(-10px)" },
          { transform: "translateX(0px)" },
          { transform: "translateX(10px)" },
          { transform: "translateX(0px)" },
          { transform: "translateX(-10px)" },
        ],
        {
          duration: 200,
          iterations: 2,
        }
      );
    }
  }
};

const showSolution = async () => {
  if (enabled.value) {
    enabled.value = false;
    await sleep(100);
    currentMons.value = solution.value.map((el) => {
      return { name: el };
    });
  }
};

const handleChange = (event: any) => {
  category.value = parseInt(event.target.value);
  getNewGame();
};

const dragOptions = ref({
  animation: 100,
  group: "description",
  ghostClass: "ghost",
  dragClass: "drag",
});

getNewGame();
</script>

<template>
  <div id="container">
    <div class="desc">
      <div style="display: flex">
        <h1 id="title">Sort by:</h1>
        <select @change="handleChange($event)">
          <option
            v-for="category in gameCategories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.title }}
          </option>
        </select>
      </div>
      <h3 v-if="stat">{{ stat }}</h3>
      <h4 id="info">{{ gameCategories[category].info }}</h4>
    </div>

    <div v-if="enabled" class="order">
      <draggable
        class="draggableRow"
        :list="currentMons"
        item-key="name"
        v-bind="dragOptions"
      >
        <template #item="{ element }">
          <PokeCard
            :dex="element.name"
            :enabled="enabled"
            :category="category"
            :stat="statIdx"
            :order="currentMons.indexOf(element)"
          />
        </template>
      </draggable>
    </div>
    <div v-else class="order draggableRow">
      <TransitionGroup name="list">
        <PokeCard
          v-for="element in currentMons"
          :key="element.name"
          :dex="element.name"
          :enabled="enabled"
          :category="category"
          :stat="statIdx"
          :order="currentMons.indexOf(element)"
        />
      </TransitionGroup>
    </div>

    <div class="control">
      <button @click="showSolution" class="btn">Give Up</button>
      <button @click="checkAnswer" class="btn">Check</button>
      <button @click="getNewGame" class="btn">New Game</button>
    </div>

    <div class="time">
      <TimeDisplay :time="elapsedTime" title="Previous Time" />
      <TimeDisplay :time="bestTime" title="Best Time" />
      <TimeDisplay :time="avgTime" title="Average Time" />
    </div>
  </div>
</template>

<style>
#container {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 125.6px);
  height: auto;
  padding: 20px;
  background-color: #f0f8ff;
}

#title {
  font-size: 2.5em;
  margin: 0 10px 0 0;
}

.desc {
  text-align: center;
  display: inherit;
  flex-direction: inherit;
  align-items: center;
}

.order {
  margin-top: 30px;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid black;
}

.draggableRow {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
}

.control {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
  font-family: inherit;
}

.ghost {
  background-color: #d3e7f7;
}

.drag {
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
  font-size: 1.5em;
  padding: 10px;
  text-transform: uppercase;
  background: #f0f8ff;
  border-radius: 50px;
  border: none;
  background: #f0f8ff;
  box-shadow:
    10px 10px 20px #868b8f,
    -10px -10px 20px #ffffff;
}

.btn:hover {
  background: #badfff;
}

.btn:active {
  transform: translateY(4px);
  box-shadow:
    5px 5px 10px #6c7074,
    -5px -5px 10px #ffffff;
}

h3 {
  margin: 10px 0 0 0;
  font-size: 1.5em;
}

select {
  font-family: "Courier New", Courier, monospace;
  font-size: 1.5em;
  border-radius: 20px;
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  background: #f0f8ff;
  box-shadow:
    inset 7px 7px 14px #b2b8bd,
    inset -7px -7px 14px #ffffff;
}

#info {
  margin: 10px 0 0 0;
  max-width: 50%;
}

.time {
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
</style>
