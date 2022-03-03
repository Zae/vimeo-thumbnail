import Vue from 'vue';
import App from './App.vue';

const el = document.getElementById('app');

// eslint-disable-next-line no-new
export default new Vue({
    el: el,
    render: (h => {
        return h(App);
    })
});
