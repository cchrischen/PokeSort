<script setup lang="ts">
import { computed } from "vue";

const props=defineProps({
    time: Number,
    title: String
})

const date = computed(() => new Date(props.time ?? 0));

const min = computed(() => `${date.value.getMinutes()}`.padStart(2, "0"));
const sec = computed(() => `${date.value.getSeconds()}`.padStart(2, "0"));
const msec = computed(() => `${date.value.getMilliseconds()}`.padStart(3, "0"));
</script>

<template>
    <div class="clock">
        <h1 v-if="time == -1">
            -
        </h1>
        <h1 v-else>
            {{ `${min}:${sec}:${msec}` }}
        </h1>
        <h2>{{ title }}</h2>
    </div>
</template>

<style>
.clock {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>