<template lang="pug">
  v-dialog(v-model="value")
    v-card.neko-card(v-if="map")
      v-card-title
        span.headline 描画設定
      v-card-text
        div.mb-1 線の色
        material-color-selector(:value="stroke", @input="value => stroke = value")
      v-card-text.py-0
        div.mb-1 線の透明度
        v-slider(v-model="strokeOpacity")
      v-card-text.py-0
        v-text-field(
          v-model="strokeWidth"
          label="線の幅"
          type="number"
        )
      v-card-text
        div.mb-1 塗りつぶしの色
        material-color-selector(:value="fill", @input="value => fill = value")
      v-card-text.py-0
        div.mb-1 塗りつぶしの透明度
        v-slider(v-model="fillOpacity")
      v-card-actions
        v-spacer
        v-btn.primary(@click="$emit('input', false)") 閉じる
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import MaterialColorSelector from './MaterialColorSelector.vue';

function dataValue(key, r) {
  return {
    get() {
      const value = this.mapControl.style[key];
      return r ? Number(value) * r : value;
    },
    set(value) {
      this.updateMapStyle({ key, value: r ? Number(value) / r : value });
    },
  };
}

export default {
  components: {
    MaterialColorSelector,
  },
  computed: {
    ...mapState([
      'mapControl',
    ]),
    stroke: dataValue('stroke'),
    strokeOpacity: dataValue('strokeOpacity', 100),
    strokeWidth: dataValue('strokeWidth'),
    fill: dataValue('fill'),
    fillOpacity: dataValue('fillOpacity', 100),
  },
  data() {
    return {
      map: {},
    };
  },
  methods: mapMutations([
    'updateMapStyle',
  ]),
  props: [
    'value',
  ],
};
</script>

<style lang="stylus" scoped>
.input-group
  // margin-bottom -22px
</style>
