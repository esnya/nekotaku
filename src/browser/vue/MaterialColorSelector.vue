<template lang="pug">
  v-card.neko-card(:style="{ border, boxShadow }")
    .neko-flex-row.neko-scroll
      div
        v-btn.neko-fixed-width(
          v-for="(c, name) in palette"
          :key="name"
          :outline="color !== name"
          :style="{ backgroundColor: colorValue, borderColor: colorValue }"
          @click="updateColor(name)"
        )
    v-divider(:style="{ backgroundColor: colorValue, boxShadow }")
    .neko-flex-row.neko-scroll
      div
        v-btn.neko-fixed-width(
          :outline="shade !== '500'"
          :style="{ backgroundColor: colorValue500, borderColor: colorValue500 }"
          @click="updateShade('500')"
        )
        v-btn.neko-fixed-width(
          v-for="(value, name) in palette[color]"
          :key="name"
          :outline="shade !== name"
          :style="{ backgroundColor: value, borderColor: value }"
          @click="updateShade(name)"
        )
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
    colorValue() {
      return this.get(...this.value);
    },
    colorValue500() {
      return this.get(this.color);
    },
    border() {
      return `1px solid ${this.colorValue}`;
    },
    boxShadow() {
      return `0 0 2px 0px ${this.colorValue}`;
    },
  },
  data() {
    return {
      palette: Palette.palette,
    };
  },
  methods: {
    get: Palette.get.bind(Palette),
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
.neko-fixed-width
  flex 0 0 36px
  min-width 36px

.expand-enter-active, .expand-leave-active
  transition transform 0.4s ease-in-out
.expand-enter
.expand-leave-to
  transform translate(100%)

</style>

