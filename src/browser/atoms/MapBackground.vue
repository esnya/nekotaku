<template lang="pug">
  .neko-map-background(:style="style")
</template>

<script>
export default {
  computed: {
    style() {
      const {
        backgroundImage,
      } = this;

      return {
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : null,
      };
    },
  },
  props: {
    backgroundImage: {
      required: false,
      type: String,
    },
  },
};
</script>

<style lang="stylus" scoped>
.neko-map-background
  background-color #ffffff
  background-size cover
</style>
