<template>
    <section>
        <h1 class="app__title">vimeo poster image</h1>
        <input id="vimeo_id" type="text" inputmode="text" v-model="vimeo" placeholder="your vimeo url">
        <div class="grid">
            <input id="width" type="number" inputmode="numeric" v-model="width" placeholder="1920" step="100">
            x
            <input id="height" type="number" inputmode="numeric" v-model="height" placeholder="1080" step="100">
        </div>
        <picture :style="`aspect-ratio: ${width} / ${height}`">
            <span v-if="isLoading" class="loading">
                <svg width="198" height="198" viewBox="0 0 198 198" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M99 1V40.2" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M99 157.8V197" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M168.287 29.7145L140.553 57.4485" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M57.448 140.552L29.714 168.286" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M197 99H157.8" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M40.2 99H0.99995" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M168.287 168.286L140.553 140.552" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M57.448 57.4485L29.714 29.7145" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            <img v-else-if="thumbnailSized && !isloading" :src="thumbnailSized" />
            <span v-else-if="!thumbnailSized && !tried">?</span>
            <span v-else class="state">wrong</span>
        </picture>

        <button
            id="thumbnailSize"
            v-clipboard:copy="thumbnailSized"
            v-clipboard:success="onCopy"
        >copy to clipboard</button>
    </section>
</template>

<script>
import Vue from 'vue';
import VueToast from 'vue-toast-notification';
import VueClipboard from 'vue-clipboard2';
import debounce from 'lodash/debounce';

import 'vue-toast-notification/dist/theme-sugar.css';

Vue.use(VueClipboard);
Vue.use(VueToast);

const VIMEOREGEX = /^(?:(\d+)|https:\/\/vimeo\.com\/(\d+))$/ig;

export default {
    data() {
        return {
            vimeo: '',
            width: 1920,
            height: 1080,
            thumbnail_url: '',
            isLoading: false,
            tried: false
        };
    },
    methods: {
        onCopy() {
            this.$toast.success('Copied to clipboard!');
        }
    },
    computed: {
        thumbnailSized() {
            return this.thumbnail_url.replace(/(.+)-d_(\d+)x(\d+)/ig, `$1-d_${this.width}x${this.height}`);
        },
        vimeoId() {
            const matches = [...this.vimeo.matchAll(VIMEOREGEX)];
            return matches?.[0]?.[1] ?? matches?.[0]?.[2] ?? null;
        }
    },
    watch: {
        vimeoId: debounce(async function(id) {
            if (!id) {
                return;
            }

            try {
                this.isLoading = true;

                const response = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}`);
                const data = await response.json();

                this.thumbnail_url = data?.thumbnail_url ?? '';
            } catch (e) {
                this.$toast.error('Video does not exist or vimeo is down or something...');
            }

            this.isLoading = false;
            this.tried = true;
        }, 200)
    }
}
</script>

<style scoped>
    .app__title {
        font-size: 6vw;
        margin: 3vw;
        text-align: center;
    }

    section {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-right: 18vw;
        padding-left: 18vw;
        background: radial-gradient(50% 50% at 50% 50%, #FF842B 0%, rgba(255, 255, 255, 0) 100%);
        min-height: 90vh;
    }

    label {
        display: none;
    }

    input {
        font-size: 1.5vw;
        padding: .7em 1.5em .6em;
        border-radius: 9999px;
        border: 0;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
        text-align: center;
    }

    input#vimeo_id {
        width: 100%;
        margin-bottom: 3vw;
    }

    .grid {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        grid-gap: 2.375rem;
        align-items: center;
        font-size: 3vw;
    }

    .grid input {
        width: 8vw;
    }

    picture {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 9vw;
        margin-top: 3vw;
        position: relative;
        width: 60vw;
        max-height: 40vh;
        background: #FF842B;
        transition: 500ms;
    }

    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        animation: load 5s infinite linear;
    }

    button {
        background: none;
        border: none;
        padding: 0;
        font-size: 3vw;
        margin: 1vw;
        cursor: pointer;
        color: rgb(78, 78, 78);
    }

    button:hover {
        color: black;
    }

    @keyframes load {
        to {
            transform: rotate(360deg);
        }
    }
</style>
