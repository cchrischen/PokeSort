<script setup lang="ts">
import { computed, ref } from "vue";

const handleFAQClick = () => faqShown.value = !faqShown.value;

const handleClose = () => faqShown.value = false;

const faqShown = ref(false);
const faqVisibility = computed(() => faqShown.value ? "visible" : "hidden");

</script>

<template>
    <div class="faq" :style="{visibility: faqVisibility}">
        <h1 class="title">
            How To Play
        </h1>
        <button class="closeButton" @click="handleClose">
            Close
        </button>
    </div>
    
    <div class="header">
        <h1 class="title">
            PokeSort
        </h1>
    
        <button class="question" @click="handleFAQClick">
            <v-icon name="pi-unown-question" />
        </button>
    </div>
    

</template>


<style>

.header{
    background-color:lightgray;
    padding: 20px 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.title {
    font-family: 'Courier New', Courier, monospace;
    font-size: 2.5em;
    margin: 0;
}

.question {
    border-radius: 3em;
    min-height: 3em;
    min-width: 3em;
}

.question:hover {
    background-color: gray;
}

.faq {
    visibility: hidden;
    position: fixed;
    background-color: aliceblue;
    width: 50%;
    height: 75%;
    padding: 20px 50px;
    left: 25%;
    top: 12.5%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.closeButton {
    border-radius: 10px;
    font-size: 20px;
    background-color: lightcoral;
}

.closeButton:hover {
    background-color:red;
}

</style>