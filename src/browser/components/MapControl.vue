<template lang="pug">
  v-card.px-0.py-1.room-tab-control
    v-layout(row align-center v-scroll="'x'")
      map-style-dialog(v-model="msdOpen")
      map-edit-dialog(v-model="medOpen")
      v-btn(icon @click="addMapZoom(0.2)")
        v-icon zoom_in
      v-btn(icon @click="addMapZoom(-0.2)")
        v-icon zoom_out
      v-btn(icon @click="resetMapZoom")
        v-icon zoom_out_map
      v-btn(icon @click="togglePerspective") 3D
      .vertical-divider
      v-btn-toggle(v-model="mode")
        v-btn(icon value="move")
          v-icon mdi-arrow-all
        v-btn(icon value="erase")
          v-icon mdi-eraser
      .vertical-divider
      v-btn-toggle(v-model="shapeType")
        v-btn(icon value="line")
          svg-icon
            line(x1="-10", y1="10", x2="10", y2="-10")
        v-btn(icon value="rect")
          svg-icon
            rect(x="-10", y="-10", width="20", height="20")
        v-btn(icon value="circle")
          svg-icon
            circle(cx="0", cy="0", r="10")
        v-btn(icon, value="polyline")
          v-icon mdi-hexagon-outline
        v-btn(icon, value="text")
          v-icon mdi-format-text
        v-btn(icon, value="ruler")
          v-icon mdi-ruler
      .vertical-divider
      v-btn(icon, @click.stop="msdOpen = true")
        v-icon palette
      v-btn(icon, @click.stop="medOpen = true")
        v-icon settings
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import ButtonGroup from '@/browser/components/ButtonGroup.vue';
import MapEditDialog from '@/browser/components/MapEditDialog.vue';
import MapStyleDialog from '@/browser/components/MapStyleDialog.vue';
import SvgIcon from '@/browser/components/SvgIcon.vue';

export default {
  components: {
    ButtonGroup,
    MapEditDialog,
    MapStyleDialog,
    SvgIcon,
  },
  computed: {
    ...mapState([
      'mapControl',
    ]),
    mode: {
      get() {
        return this.mapControl.mode;
      },
      set(mode) {
        this.setMapMode({ mode, shapeType: null });
      },
    },
    shapeType: {
      get() {
        return this.mode === 'create' ? this.mapControl.shapeType : null;
      },
      set(shapeType) {
        this.setMapMode({ mode: 'create', shapeType });
      },
    },
  },
  methods: mapMutations([
    'addMapZoom',
    'resetMapZoom',
    'setMapMode',
    'togglePerspective',
  ]),
  data() {
    return {
      msdOpen: false,
      medOpen: false,
    };
  },
};
</script>

<style lang="stylus" scoped>
.vertical-divider
  margin 0 8px
  height 28px
  display inline-block
  border-right 1px solid rgba(0, 0, 0, 0.45)

.v-btn-toggle--selected
  box-shadow none
</style>
