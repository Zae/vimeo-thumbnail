<template>
  <section>
      <header>
          <DnFormField
            :required="true"
          >
              <template v-slot:label>
                  <label for="vimeo">
                      Vimeo URL / ID
                  </label>
              </template>

              <template v-slot:description>
                  DE URL VAN DE VIMEO VIDEO
              </template>

              <div> <!-- v-slot:default -->
                  <DnInput
                      id="vimeo_id"
                      type="text"
                      inputmode="text"
                      v-model="vimeo"
                  >
                  </DnInput>
              </div>
          </DnFormField>

          <DnFormField
            :required="true"
          >
              <template v-slot:label>
                  <label for="vimeo_id">
                      Width
                  </label>
              </template>

              <template v-slot:description>
                  De gewenste breedte van de thumbnail
              </template>

              <div> <!-- v-slot:default -->
                  <DnInput
                      id="width"
                      type="number"
                      inputmode="numeric"
                      v-model="width"
                  >
                  </DnInput>
              </div>
          </DnFormField>

          <DnFormField
            :required="true"
          >
              <template v-slot:label>
                  <label for="height">
                      Height
                  </label>
              </template>

              <template v-slot:description>
                  De gewenste height van de thumbnail
              </template>

              <div> <!-- v-slot:default -->
                  <DnInput
                      id="height"
                      type="number"
                      inputmode="numeric"
                      v-model="height"
                  >
                  </DnInput>
              </div>
          </DnFormField>
      </header>

      <article v-if="thumbnailSized">
          <DnFormField
              :required="true"
              :readonly="true"
          >
              <template v-slot:label>
                  <label for="height">
                      URL
                  </label>
              </template>

              <div> <!-- v-slot:default -->
                  <DnInput
                      @focus="onFocus"
                      :readonly="true"
                      id="thumbnailSize"
                      type="text"
                      inputmode="text"
                      v-model="thumbnailSized"
                  >
                  </DnInput>
              </div>
          </DnFormField>

          <img :src="thumbnailSized" style="max-width: 100%" />
      </article>
  </section>

</template>

<script>
import Vue from 'vue';
import DnFormField from '@digitalnatives/form-field';
import DnInput from '@digitalnatives/form-input';
import DnButton from '@digitalnatives/button';
import VueToast from 'vue-toast-notification';
import VueClipboard from 'vue-clipboard2';
import { get as httpGet } from 'axios';
import debounce from 'lodash/debounce';
import get from 'lodash/get';

// import 'vue-toast-notification/dist/theme-default.css';
import 'vue-toast-notification/dist/theme-sugar.css';

Vue.use(VueClipboard);
Vue.use(VueToast);

const VIMEOREGEX = /^(\d+)|https:\/\/vimeo\.com\/(\d+)$/ig;

export default {
    components: {
        DnFormField,
        DnInput,
        DnButton
    },
    data() {
        return {
            vimeo: '467336002',
            width: 1920,
            height: 1080,
            thumbnail_url: ''
        };
    },
    methods: {
        onFocus() {
            this.$copyText(this.thumbnailSized);
            this.$toast.open('The url was copied to your clipboard');
        }
    },
    computed: {
        thumbnailSized() {
            return this.thumbnail_url.replace(/(.+)-d_(\d+)x(\d+)/ig, `$1-d_${this.width}x${this.height}`);
        },
        vimeoId() {
            const matches = [...this.vimeo.matchAll(VIMEOREGEX)];

            return get(matches, '0.2', get(matches, '0.1', null));
        }
    },
    watch: {
        vimeoId: debounce(async function(id) {
            if (!id) {
                return;
            }

            try {
                const response = await httpGet(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}`);
                this.thumbnail_url = response?.data?.thumbnail_url ?? '';
            } catch (e) {
                this.$toast.error('Video does not exist or vimeo is down or something...');
            }
        }, 200)
    }
}
</script>

<style scoped>

</style>
