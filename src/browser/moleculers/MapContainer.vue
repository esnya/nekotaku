<template lang="pug">
  .neko-map(
    ref="container"
    :class="classList"
    :style="style"
    @mousedown="onTouchMap"
    @touchstart="onTouchMap"
  )
    map-background(:backgroundImage="map.backgroundImage")
    map-grid(:width="map.width" :height="map.height" v-if="map.grid")
    map-shape-layer(:mode="mapControl.mode" @touch-entity="onTouchShape")
    map-character-layer(@touch-entity="onTouchCharacter")
</template>

<script>
import { bindAsList } from '@/browser/models';
import { mapState } from 'vuex';
import MapBackground from '@/browser/atoms/MapBackground.vue';
import MapCharacterLayer from '@/browser/moleculers/MapCharacterLayer.vue';
import MapController from '@/browser/map/MapController';
import MapGrid from '@/browser/atoms/MapGrid.vue';
import MapShapeLayer from '@/browser/moleculers/MapShapeLayer.vue';

export default {
  mixins: [
    bindAsList('characters'),
    bindAsList('shapes'),
  ],
  components: {
    MapBackground,
    MapCharacterLayer,
    MapGrid,
    MapShapeLayer,
  },
  computed: {
    ...mapState([
      'mapControl',
    ]),
    classList() {
      return {
        perspective: this.mapControl.perspective,
      };
    },
    scale() {
      return 2 ** this.mapControl.zoom;
    },
    style() {
      const {
        width,
        height,
      } = this.map;

      return {
        transform: `scale(${this.scale})`,
        width: `${width * 50}px`,
        height: `${height * 50}px`,
      };
    },
  },
  methods: {
    onTouchCharacter(event, character) {
      this.$controller.onTouchCharacter(event, character);
    },
    onTouchMap(event) {
      this.$controller.onTouchMap(event);
    },
    onTouchShape(event, shape) {
      this.$controller.onTouchShape(event, shape);
    },
  },
  mounted() {
    this.$controller = new MapController(
      this.$store,
      this.$models,
      this.roomId,
      this.$refs.container,
    );
  },
  destroyed() {
    this.$controller.destroy();
  },
  props: {
    map: {
      required: true,
      type: Object,
    },
  },
};
</script>

<style lang="stylus" scoped>
.neko-map
  margin 100px 50px
  position relative
  transform-origin top left
  perspective 1000px

  transform-style preserve-3d
  transition transform 0.2s ease-in-out, perspective 0.2s ease-in-out
  :global(*)
    transform-style preserve-3d

  > :global(*)
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    transform-origin bottom
    transition transform 0.2s ease-in-out, perspective 0.2s ease-in-out

  &.perspective > :global(*)
    transform rotateX(70deg)
</style>
