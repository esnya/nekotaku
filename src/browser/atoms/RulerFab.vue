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
      v-icon mdi-ruler
    span 定規を描く
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
