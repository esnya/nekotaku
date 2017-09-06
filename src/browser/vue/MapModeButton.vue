<template lang="pug">
  v-btn.map-mode-button(icon, :class="{current: currentMode === mode}", @click="onSetMode(mode)")
    svg(width="36", height="36")
      g
        slot
</template>

<script>
export default {
  props: [
    'mode',
    'currentMode',
    'onSetMode',
  ],
};
</script>

<style lang="stylus" scoped>
.map-mode-button
  padding: 6;

  svg > g
    transform: translate(18px, 18px);
    stroke: rgba(0, 0, 0, 0.5);
    storkeWidth: 2;
    fill: none;

.map-mode-button.current svg *
  stroke: #1976d2;
</style>
