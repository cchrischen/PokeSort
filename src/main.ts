import './assets/styles.css'

import { createApp } from 'vue'
import App from './App.vue'

import { OhVueIcon, addIcons } from "oh-vue-icons";
import { PiUnownQuestion } from "oh-vue-icons/icons";

addIcons(PiUnownQuestion);

const app = createApp(App);
app.component("v-icon", OhVueIcon);
app.mount("#app");
