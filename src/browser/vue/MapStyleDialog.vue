<template lang="pug">
  v-dialog(v-model="open")
    v-btn(icon, slot="activator")
      v-icon palette
    v-card.neko-card(v-if="map")
      v-card-title
        span.headline 描画設定
      v-card-text
        div.mb-1 線の色
        material-color-selector
      v-card-text.py-0
        div.mb-1 線の透明度
        v-slider(
          :min="0"
          :max="1"
          :value="0.9"
          :step="0.1"
        )
      v-card-text.py-0
        v-text-field(
          label="線の幅"
          type="number"
          value="1"
        )
      v-card-text
        div.mb-1 塗りつぶしの色
        material-color-selector
      v-card-text.py-0
        div.mb-1 塗りつぶしの透明度
        v-slider(
          :min="0"
          :max="1"
          :value="0.8"
          :step="0.1"
        )
      v-card-actions
        v-spacer
        v-btn.primary 閉じる
</template>

<script>
import MaterialColorSelector from './MaterialColorSelector.vue';

export default {
  components: {
    MaterialColorSelector,
  },
  data() {
    return {
      map: {},
      open: false,
    };
  },
};
</script>

<style lang="stylus" scoped>
.input-group
  // margin-bottom -22px
</style>
