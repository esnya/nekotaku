<template lang="pug">
  simple-dialog(title="マップ描画設定" :value="value", @input="$emit('input', $event)")
    color-select(label="線の色" v-model="stroke")
    opacity-input(label="線の不透明度" v-model="strokeOpacity")
    number-input(label="線の幅" name="strokeWidth" v-model="strokeWidth")
    color-select(label="塗りの色" v-model="fill")
    opacity-input(label="塗りの不透明度" v-model="fillOpacity")
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import ColorSelect from '@/browser/atoms/ColorSelect.vue';
import NumberInput from '@/browser/atoms/NumberInput.vue';
import OpacityInput from '@/browser/atoms/OpacityInput.vue';
import SimpleDialog from '@/browser/moleculers/SimpleDialog.vue';

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
    ColorSelect,
    OpacityInput,
    NumberInput,
    SimpleDialog,
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
  props: {
    value: {
      required: true,
      type: Boolean,
    },
  },
};
</script>
