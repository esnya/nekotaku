<template lang="pug">
  svg.neko-map-shape-layer
    map-shape-item(
      :key="shape.id"
      :shape="shape"
      :show-handle="showHandle"
      v-for="shape in sortedShapes"
      @touch="$emit('touch-entity', $event, shape)"
    )
</template>

<script>
import { bindAsList } from '@/browser/models';
import MapShapeItem from '@/browser/moleculers/MapShapeItem.vue';

export default {
  mixins: [
    bindAsList('shapes'),
  ],
  components: {
    MapShapeItem,
  },
  computed: {
    showHandle() {
      const {
        mode,
      } = this;

      return mode === 'move' || mode === 'erase';
    },
    sortedShapes() {
      return this.shapes.slice().sort((a, b) => a.z > b.z);
    },
  },
  props: {
    mode: {
      required: true,
      type: String,
    },
  },
};
</script>
