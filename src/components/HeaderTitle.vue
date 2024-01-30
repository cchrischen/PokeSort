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
        <p>
            Your goal is to order the 6 randomly generated Pokemon based on a particular category.
        </p>
        <p>
            You can select the category in the dropdown menu. The Base Stat category will randomly choose between the six base stats and base stat total.
        </p>
        <p>
            A Pokemon species is defined as the Pokemon without regard to its form. For instance, the species of Mega Venusaur is Venusaur. The species of Alolan Raichu is Raichu. This will be important for Name Chain and National Dex.
        </p>
        <p>
            Non-decreasing means that every element is greater than or equal to the element coming before it.
        </p>
        <p>
            Have fun!
        </p>
        <button class="closeButton" @click="handleClose">
            CLOSE
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
    padding: 20px 50px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    border: 1px solid black;
}

.closeButton {
    border-radius: 10px;
    font-size: 20px;
    background-color: #f08080;
}

.closeButton:hover {
    background-color:#eb6868;
}

p {
    margin: 0.5em 0;
}
</style>