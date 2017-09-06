<template lang="pug">
  v-card.neko-flex-row.neko-scroll
    v-spacer
    v-btn(icon, @click="addMapZoom(0.1)")
      v-icon zoom_in
    v-btn(icon, @click="addMapZoom(-0.1)")
      v-icon zoom_out
    v-btn(icon, @click="resetMapZoom")
      v-icon zoom_out_map
    div.vertical-divider
    v-btn(icon, @click="setMapMode('move')")
      v-icon(:primary="mapControl.mode === 'move'") mdi-arrow-all
    div.vertical-divider
    map-mode-button(mode="line", :currentMode="mapControl.mode", :onSetMode="setMapMode")
      line(x1="-12", y1="12", x2="12", y2="-12")
    map-mode-button(mode="rect", :currentMode="mapControl.mode", :onSetMode="setMapMode")
      rect(x="-12", y="-12", width="24", height="24")
    map-mode-button(mode="circle", :currentMode="mapControl.mode", :onSetMode="setMapMode")
      circle(cx="0", cy="0", r="12")
    div.vertical-divider
    v-btn(icon)
      v-icon palette
    v-spacer
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import MapModeButton from './MapModeButton.vue';

export default {
  components: {
    MapModeButton,
  },
  computed: {
    ...mapState([
      'mapControl',
    ]),
  },
  methods: mapMutations([
    'addMapZoom',
    'resetMapZoom',
    'setMapMode',
  ]),
};
</script>

<style lang="stylus" scoped>
// .neko-container
//   overflow auto

.vertical-divider
  position relative
  top 8px
  height 24px
  display inline-block
  border-right 1px solid rgba(0, 0, 0, 0.12)
</style>
