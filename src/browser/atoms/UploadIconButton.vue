<template lang="pug">
  v-tooltip
    v-btn(
      icon
      slot="activator"
      color="blue"
      :disabled="disabled"
      @click="$emit('click', $event)"
    )
      v-icon(color="white") cloud_upload
    span アップロード
</template>

<script>
export default {
  props: {
    disabled: {
      required: false,
      type: Boolean,
    },
  },
};
</script>
