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
      v-icon palette
    span 描画設定
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
