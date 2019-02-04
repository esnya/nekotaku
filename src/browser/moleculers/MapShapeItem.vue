<template lang="pug">
  g(
    @mousedown="$emit('touch', $event)"
    @touchstart="$emit('touch', $event)"
  )
    shape(:shape="shape")
    shape(handle :shape="shape" v-if="showHandle")
</template>

<script>
import Shape from '@/browser/atoms/Shape.vue';

export default {
  components: {
    Shape,
  },
  props: {
    shape: {
      required: true,
      type: Object,
    },
    showHandle: {
      required: true,
      type: Boolean,
    },
  },
};
</script>
