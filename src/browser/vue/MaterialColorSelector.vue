<template lang="pug">
  v-card.neko-card(:style="{ border, boxShadow }")
    .neko-flex-row.neko-scroll
      div
        v-btn.neko-fixed-width(
          v-for="(c, name) in palette"
          :key="name"
          :outline="colorName !== name"
          :style="{ backgroundColor: c['500'], borderColor: c['500'] }"
          @click="colorName = name;"
        )
    v-divider(:style="{ backgroundColor: color, boxShadow }")
    .neko-flex-row.neko-scroll
      div
        v-btn.neko-fixed-width(
          :outline="brightness !== '500'"
          :style="{ backgroundColor: color500, borderColor: color500 }"
          @click="brightness = '500'"
        )
        v-btn.neko-fixed-width(
          v-for="(value, name) in palette[colorName]"
          :key="name"
          :outline="brightness !== name"
          :style="{ backgroundColor: value, borderColor: value }"
          @click="brightness = name"
        )
</template>

<script>
import { palette } from 'google-material-color';

export default {
  computed: {
    color() {
      return palette[this.colorName][this.brightness];
    },
    color500() {
      return palette[this.colorName]['500'];
    },
    border() {
      return `1px solid ${this.color}`;
    },
    boxShadow() {
      return `0 0 2px 0px ${this.color}`;
    },
  },
  data() {
    return {
      palette,
      brightness: '500',
      colorName: 'Red',
    };
  },
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

