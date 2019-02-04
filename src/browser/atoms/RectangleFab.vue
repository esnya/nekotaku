<template lang="pug">
  v-tooltip(left)
    v-btn(
      fab
      slot="activator"
      :color="color"
      :dark="dark"
      :small="small"
      @click="$emit('click', $event)"
    )
      v-icon mdi-vector-rectangle
    span 長方形を描く
</template>

<script>
export default {
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
  },
};
</script>
