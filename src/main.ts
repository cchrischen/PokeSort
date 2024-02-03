import './assets/styles.css'

import { createApp } from 'vue'
import App from './App.vue'
import { inject } from '@vercel/analytics';
 
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { PiUnownQuestion } from "oh-vue-icons/icons";

addIcons(PiUnownQuestion);
inject();

const app = createApp(App);
app.component("v-icon", OhVueIcon);
app.mount("#app");
