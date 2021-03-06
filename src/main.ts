import { createApp } from 'vue';
import App from './App.vue';
import { VTooltip } from 'floating-vue';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'floating-vue/dist/style.css'

const app = createApp(App);

app.directive('tooltip', VTooltip)
app.mount('#app');
