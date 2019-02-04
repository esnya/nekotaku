<template lang="pug">
  line-fab(
    :color="color"
    :dark="dark"
    :small="small"
    @click="$emit('click', $event)"
    v-if="shapeType === 'line'"
  )
  rectangle-fab(
    :color="color"
    :dark="dark"
    :small="small"
    @click="$emit('click', $event)"
    v-else-if="shapeType === 'rect'"
  )
  circle-fab(
    :color="color"
    :dark="dark"
    :small="small"
    @click="$emit('click', $event)"
    v-else-if="shapeType === 'circle'"
  )
  polyline-fab(
    :color="color"
    :dark="dark"
    :small="small"
    @click="$emit('click', $event)"
    v-else-if="shapeType === 'polyline'"
  )
  text-fab(
    :color="color"
    :dark="dark"
    :small="small"
    @click="$emit('click', $event)"
    v-else-if="shapeType === 'text'"
  )
  ruler-fab(
    :color="color"
    :dark="dark"
    :small="small"
    @click="$emit('click', $event)"
    v-else-if="shapeType === 'ruler'"
  )
  div(v-else)
</template>

<script>
import CircleFab from '@/browser/atoms/CircleFab.vue';
import LineFab from '@/browser/atoms/LineFab.vue';
import PolylineFab from '@/browser/atoms/PolylineFab.vue';
import RectangleFab from '@/browser/atoms/RectangleFab.vue';
import RulerFab from '@/browser/atoms/RulerFab.vue';
import TextFab from '@/browser/atoms/TextFab.vue';

export default {
  components: {
    CircleFab,
    LineFab,
    PolylineFab,
    RectangleFab,
    RulerFab,
    TextFab,
  },
  props: {
    color: {
      type: String,
    },
    dark: {
      type: Boolean,
    },
    small: {
      type: Boolean,
    },
    shapeType: {
      type: String,
    },
  },
};
</script>
