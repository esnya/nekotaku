<template lang="pug">
  v-dialog(v-if="map" :value="value", @input="v => $emit('input', v)")
    v-card(v-scroll="'y'")
      v-card-title
        span.headline マップ設定
      v-card-text
        v-text-field(
          label="幅"
          type="number"
          minValue="1"
          :value="map.width"
          @input="v => updateMap({ key: 'width', value: Number(v) })"
        )
        v-text-field(
          label="高さ"
          type="number"
          minValue="1"
          :value="map.height"
          @input="v => updateMap({ key: 'height', value: Number(v) })"
        )
        .neko-flex-row
          file-input.success(accept="image/*", @input="updateMapBackgroundImage") 背景変更
          v-btn.warning(@click="clearMapBackgroundImage") 背景クリア
      v-card-actions
        v-spacer
        v-btn(@click="$emit('input', false)") 閉じる
</template>

<script>
import { mapActions, mapState } from 'vuex';
import FileInput from './FileInput.vue';

export default {
  components: {
    FileInput,
  },
  computed: mapState([
    'map',
  ]),
  methods: mapActions([
    'updateMap',
    'updateMapBackgroundImage',
    'clearMapBackgroundImage',
  ]),
  props: [
    'value',
  ],
};
</script>
