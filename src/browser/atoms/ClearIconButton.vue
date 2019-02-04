<template lang="pug">
  v-tooltip
    v-btn(
      icon
      slot="activator"
      :color="color"
      :disabled="disabled"
      @click="$emit('click', $event)"
    )
      v-icon(:color="color ? 'white' : null") clear
    span 消去
</template>

<script>
export default {
  props: {
    color: {
      required: false,
      type: String,
    },
    disabled: {
      required: false,
      type: Boolean,
    },
  },
};
</script>
