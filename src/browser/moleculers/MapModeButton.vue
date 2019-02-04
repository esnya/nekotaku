<template lang="pug">
  move-fab(
    :color="color"
    :dark="dark"
    :small="small"
    @click="$emit('click', $event)"
    v-if="mode === 'move'"
  )
  erase-fab(
    :color="color"
    :dark="dark"
    :small="small"
    @click="$emit('click', $event)"
    v-else-if="mode === 'erase'"
  )
  div(v-else)
</template>

<script>
import EraseFab from '@/browser/atoms/EraseFab.vue';
import MoveFab from '@/browser/atoms/MoveFab.vue';

export default {
  components: {
    EraseFab,
    MoveFab,
  },
  props: {
    color: {
      type: String,
    },
    dark: {
      type: Boolean,
    },
    mode: {
      required: true,
      type: String,
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
