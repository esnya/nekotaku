<template lang="pug">
  youtube(
    ref="youtube"
    width="100%"
    :resize="true"
    :video-id="videoId"
  )
</template>

<script>
export default {
  props: {
    videoId: {
      type: String,
      required: true,
    },
  },
  mounted() {
    const {
      youtube,
    } = this.$refs;
    if (youtube) youtube.player.playVideo();
  },
};
</script>
