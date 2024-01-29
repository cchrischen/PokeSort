<script setup lang="ts">
import { computed, ref } from "vue";

const handleFAQClick = () => faqShown.value = !faqShown.value;

const handleClose = () => faqShown.value = false;

const faqShown = ref<boolean>(false);
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
        <div>
            <button class="icon" @click="handleFAQClick">
                <v-icon name="pi-unown-question" />
            </button>
        </div>
    </div>
    

</template>


<style>

.header{
    
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

.icon {
    border-radius: 3em;
    min-height: 3em;
    min-width: 3em;
    margin: 0px 1em;
}

.icon:hover {
    background-color: gray;
}

.faq {
    visibility: hidden;
    position: fixed;
    background-color: #f0f8ff;
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

.menu {
    position: fixed;
    right: 10em;
    top: 4em;
    background-color:bisque;
    padding: 1em;
    display: flex;
}
</style>