<template lang="pug">
  v-layout(row)
    v-flex(xs6)
      v-select(
        label="色"
        :value="color"
        :items="colors"
        @input="updateColor"
      )
        template(slot="selection" slot-scope="data")
          div.fill(:style="{ backgroundColor: getColor(data.item) }")
        template(slot="item" slot-scope="data")
          div.fill(:style="{ backgroundColor: getColor(data.item) }")
    v-flex(xs6)
      v-select(
        label="明るさ"
        :value="shade"
        :items="shades"
        @input="updateShade"
      )
        template(slot="selection" slot-scope="data")
          div.fill(:style="{ backgroundColor: getColor(color, data.item) }")
        template(slot="item" slot-scope="data")
          div.fill(:style="{ backgroundColor: getColor(color, data.item) }")
</template>

<script>
import Palette from 'google-material-color';

export default {
  computed: {
    color() {
      return this.value[0];
    },
    shade() {
      return this.value[1];
    },
    colors() {
      return Object.keys(Palette.palette);
    },
    shades() {
      return Object.keys(Palette.palette[this.value[0]]);
    },
  },
  data() {
    return {
    };
  },
  methods: {
    getColor: Palette.get.bind(Palette),
    updateColor(color) {
      this.$emit('input', [color, this.value[1]]);
    },
    updateShade(shade) {
      this.$emit('input', [this.value[0], shade]);
    },
  },
  props: [
    'value',
  ],
};
</script>

<style lang="stylus" scoped>
.fill
  width 100%
  height 100%
</style>

