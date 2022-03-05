import { createApp } from 'vue';
import VueToast from 'vue-toast-notification';
import VueClipboard from 'vue3-clipboard';
import 'vue-toast-notification/dist/theme-sugar.css';

import App from './App.vue';

const app = createApp(App);

app.use(VueToast);
app.use(VueClipboard, {
    autoSetContainer: true,
    appendToBody: false,
})
app.mount('#app');
