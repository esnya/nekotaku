<template lang="pug">
  div
    fixed-bottom-right
      v-speed-dial(v-model="fab")
        shape-type-button(
          color="primary"
          slot="activator"
          :shapeType="mapControl.shapeType"
          @click="fab = true"
          v-if="mapControl.mode === 'create'"
        )
        map-mode-button(
          color="primary"
          slot="activator"
          :mode="mapControl.mode"
          @click="fab = true"
          v-else
        )
        template(v-if="mode === 'root'")
          map-setting-fab(dark small @click="settingDialog = true")
          palette-fab(dark small @click="styleDialog = true")
          draw-fab(dark small color="green" @click.stop="mode = 'draw'")
          map-mode-button(
            dark
            small
            color="red"
            :key="mode"
            :mode="mode"
            @click="updateMapMode({ mode })"
            v-for="mode in modes"
          )
          zoom-fab(dark small color="orange" @click.stop="mode = 'zoom'")
        template(v-else-if="mode === 'zoom'")
          perspective-fab(dark small color="orange" @click.stop="togglePerspective")
          zoom-reset-fab(dark small color="orange" @click.stop="resetMapZoom")
          zoom-out-fab(dark small color="orange" @click.stop="addMapZoom(-0.2)")
          zoom-in-fab(dark small color="orange" @click.stop="addMapZoom(0.2)")
        template(v-else-if="mode === 'draw'")
          shape-type-button(
            dark
            small
            color="green"
            :key="shapeType"
            :shape-type="shapeType"
            @click="updateMapMode({ mode: 'create', shapeType })"
            v-for="shapeType in shapeTypes"
          )
        div(v-else)
    map-setting-dialog(:map="map" v-model="settingDialog")
    map-style-dialog(:map="map" v-model="styleDialog")
</template>

<script>
import DrawFab from '@/browser/atoms/DrawFab.vue';
import FixedBottomRight from '@/browser/atoms/FixedBottomRight.vue';
import MapSettingFab from '@/browser/atoms/MapSettingFab.vue';
import PaletteFab from '@/browser/atoms/PaletteFab.vue';
import PerspectiveFab from '@/browser/atoms/PerspectiveFab.vue';
import ZoomFab from '@/browser/atoms/ZoomFab.vue';
import ZoomInFab from '@/browser/atoms/ZoomInFab.vue';
import ZoomOutFab from '@/browser/atoms/ZoomOutFab.vue';
import ZoomResetFab from '@/browser/atoms/ZoomResetFab.vue';
import MapModeButton from '@/browser/moleculers/MapModeButton.vue';
import ShapeTypeButton from '@/browser/moleculers/ShapeTypeButton.vue';
import MapSettingDialog from '@/browser/moleculers/MapSettingDialog.vue';
import MapStyleDialog from '@/browser/moleculers/MapStyleDialog.vue';
import { mapState, mapMutations } from 'vuex';

export default {
  components: {
    DrawFab,
    FixedBottomRight,
    MapModeButton,
    MapSettingDialog,
    MapSettingFab,
    MapStyleDialog,
    PaletteFab,
    PerspectiveFab,
    ShapeTypeButton,
    ZoomFab,
    ZoomInFab,
    ZoomOutFab,
    ZoomResetFab,
  },
  computed: {
    ...mapState(['mapControl']),
    modes() {
      return [
        'move',
        'erase',
      ].reverse();
    },
    shapeTypes() {
      return [
        'line',
        'rect',
        'circle',
        'polyline',
        'text',
        'ruler',
      ].reverse();
    },
  },
  data: () => ({
    fab: false,
    settingDialog: false,
    styleDialog: false,
    mode: 'root',
  }),
  methods: {
    ...mapMutations([
      'addMapZoom',
      'resetMapZoom',
      'togglePerspective',
      'updateMapMode',
    ]),
  },
  watch: {
    fab(value) {
      if (!value) this.mode = 'root';
    },
  },
  props: {
    map: {
      required: true,
      type: Object,
    },
  },
};
</script>
