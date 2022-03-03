<template>
  <section>
      <header>
          <DnFormField
            :required="true"
          >
              <template v-slot:label>
                  <label for="vimeo_id">
                      Vimeo ID
                  </label>
              </template>

              <template v-slot:description>
                  HET ID VAN DE VIMEO ID
              </template>

              <div> <!-- v-slot:default -->
                  <DnInput
                      id="vimeo_id"
                      type="text"
                      inputmode="text"
                      v-model="vimeoId"
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
                      v-model="width"
                  >
                  </DnInput>
              </div>
          </DnFormField>

          <DnButton @click="onClick">CLICK ME</DnButton>
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
import DnFormField from '@digitalnatives/form-field';
import DnInput from '@digitalnatives/form-input';
import DnButton from '@digitalnatives/button';
import { get } from 'axios';

export default {
    components: {
        DnFormField,
        DnInput,
        DnButton
    },
    data() {
        return {
            vimeoId: null,
            width: 1920,
            height: 1080,
            thumbnail_url: ''
        };
    },
    methods: {
        async onClick() {
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

</style>
