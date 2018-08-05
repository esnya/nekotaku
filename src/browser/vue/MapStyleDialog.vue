<template lang="pug">
  v-dialog(:value="value", @input="v => $emit('input', v)")
    v-card(v-scroll="'y'")
      v-card-title
        span.headline 描画設定
      v-card-text
        div.mb-1 線の色
        compact(:value="stroke" @input="stroke = $event.hex")
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
        compact(:value="fill" @input="fill = $event.hex")
      v-card-text.py-0
        div.mb-1 塗りつぶしの透明度
        v-slider(v-model="fillOpacity")
      v-card-actions
        v-spacer
        v-btn(@click="$emit('input', false)") 閉じる
</template>

<script>
import { Compact } from 'vue-color';
import { mapMutations, mapState } from 'vuex';

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
    Compact,
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
  methods: mapMutations([
    'updateMapStyle',
  ]),
  props: [
    'value',
  ],
};
</script>
