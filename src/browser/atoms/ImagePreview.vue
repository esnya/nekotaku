<template lang="pug">
  img.neko-image-preview(
    :src="url"
    v-if="url"
  )
  .neko-image-preview.neko-empty(v-else)
</template>

<script>
export default {
  props: {
    url: {
      required: false,
      type: String,
    },
  },
};
</script>

<style lang="stylus" scoped>
.neko-image-preview
  width 150px
  height 150px
  object-fit cover

.neko-empty
  background-color #ddd
</style>
