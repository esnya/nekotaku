<template lang="pug">
  v-card.my-2(v-if="node.type === 'dice'", v-bind:class="colorOptions.classNames", :dark="colorOptions.dark")
    v-card-title.caption.px-2.pt-2.pb-0 {{node.dice}}
    v-card-text.pa-2 {{node.text}}
  v-card.my-2(v-else-if="node.type === 'memoOpen'")
    v-card-title.caption.px-2.pt-2.pb-0
      v-icon mdi-note
      span {{node.title}}
    v-card-text.pa-2 {{node.text}}
  div(v-else-if="youtubeId")
    youtube(
      ref="youtube"
      width="100%"
      :resize="true"
      :video-id="youtubeId"
    )
  div(v-else-if="isurl")
    a(:href="node.text" target="_blank") {{node.text}}
  div(v-else) {{node.text}}
</template>

<style lang="stylus" scoped>
iframe
  border none
  width 100%
</style>

<script>
import isUrl from 'is-url';
import getYoutubeId from 'get-youtube-id';

export default {
  computed: {
    colorOptions() {
      const { node } = this;

      if (node.type === 'dice') {
        if (node.text.match(/成功$/)) return { classNames: { green: true }, dark: true };
        else if (node.text.match(/失敗$/)) return { classNames: { red: true }, dark: true };
      }

      return {};
    },
    isurl() {
      return isUrl(this.node.text);
    },
    youtubeId() {
      return this.isurl ? getYoutubeId(this.node.text) : null;
    },
    uriEncodedText() {
      return encodeURIComponent(this.node.text);
    },
  },
  mounted() {
    this.$nextTick(() => {
      const isNewMessage = Date.now() - this.createdAt < 1000 * 30;
      if (isNewMessage && this.$refs.youtube) this.$refs.youtube.player.playVideo();
    });
  },
  props: {
    node: {
      type: Object,
      required: true,
    },
    createdAt: {
      type: Number,
      required: true,
    },
  },
};
</script>
