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
      v-icon zoom_out_map
    span 等倍表示
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
