<template>
    <section>
        <h1 class="app__title">vimeo poster image</h1>
        <input id="vimeo_id" type="text" inputmode="text" v-model="vimeoId" placeholder="your vimeo url" @change="getThumbnail">
        <div class="grid">
            <input id="width" type="number" inputmode="numeric" v-model="width" placeholder="1920">
            x
            <input id="height" type="number" inputmode="numeric" v-model="height" placeholder="1080">
        </div>
        <picture :style="`aspect-ratio: ${width} / ${height}`">
            <img v-if="thumbnailSized" :src="thumbnailSized" />
        </picture>
        <button v-if="thumbnailSized" id="thumbnailSize">{{ thumbnailSized }}</button>
    </section>
</template>

<script>
import { get } from 'axios';

export default {
    data() {
        return {
            vimeoId: null,
            width: 1920,
            height: 1080,
            thumbnail_url: ''
        };
    },
    methods: {
        async getThumbnail() {
            const { data: { thumbnail_url } } = await get(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${this.vimeoId}`);
            this.thumbnail_url = thumbnail_url ?? '';
        }
    },
    computed: {
        thumbnailSized() {
            return this.thumbnail_url.replace(/(.+)-d_(\d+)x(\d+)/ig, `$1-d_${this.width}x${this.height}`);
        }
    }
}
</script>

<style scoped>
    .app__title {
        font-size: 7vw;
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
        min-height: 100vh;
    }

    label {
        display: none;
    }

    input {
        font-size: 1.5vw;
        padding: .7em 1.5em;
        border-radius: 9999px;
        border: 0;
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
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
        margin-top: 3vw;
        position: relative;
        width: 70vw;
        max-height: 40vh;
        background: #FFB72B;
        transition: 500ms;
    }

    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
