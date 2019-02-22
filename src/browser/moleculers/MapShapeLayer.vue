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

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapShapeItem from '@/browser/moleculers/MapShapeItem.vue';
import { BindAsList } from '@/browser/decorators/dao';
import shapeDAO from '@/browser/dao/shapeDAO';
import Shape from '@/models/Shape';

@Component({
  components: {
    MapShapeItem,
  },
})
export default class MapShapeLayer extends Vue {
  @BindAsList(shapeDAO) shapes!: Shape[];
  @Prop({ required: true }) mode!: string;

  get showHandle() {
    const {
      mode,
    } = this;

    return mode === 'move' || mode === 'erase';
  }

  get sortedShapes() {
    return this.shapes.slice().sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());
  }
}
</script>
