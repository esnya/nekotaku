<template lang="pug">
  v-card.px-0.py-1.neko-flex-row.neko-scroll
    map-style-dialog(v-model="msdOpen")
    map-edit-dialog(v-model="medOpen")
    button-group
      v-btn(icon, @click="addMapZoom(0.2)")
        v-icon zoom_in
      v-btn(icon, @click="addMapZoom(-0.2)")
        v-icon zoom_out
      v-btn(icon, @click="resetMapZoom")
        v-icon zoom_out_map
    .vertical-divider
    button-group(toggle, v-model="mode")
      v-btn(icon, value="move")
        v-icon mdi-arrow-all
      v-btn(icon, value="erase")
        v-icon mdi-eraser
    .vertical-divider
    button-group(toggle, v-model="shapeType")
      v-btn(icon, value="line")
        svg-icon
          line(x1="-10", y1="10", x2="10", y2="-10")
      v-btn(icon, value="rect")
        svg-icon
          rect(x="-10", y="-10", width="20", height="20")
      v-btn(icon, value="circle")
        svg-icon
          circle(cx="0", cy="0", r="10")
      v-btn(icon, value="ruler")
        v-icon mdi-ruler
    .vertical-divider
    button-group
      v-btn(icon, @click.stop="msdOpen = true")
        v-icon palette
      v-btn(icon, @click.stop="medOpen = true")
        v-icon settings
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import ButtonGroup from './ButtonGroup.vue';
import MapEditDialog from './MapEditDialog.vue';
import MapStyleDialog from './MapStyleDialog.vue';
import SvgIcon from './SvgIcon.vue';

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
  position relative
  top 4px
  height 28px
  display inline-block
  border-right 1px solid rgba(0, 0, 0, 0.45)
</style>
