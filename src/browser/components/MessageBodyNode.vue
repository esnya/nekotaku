<template lang="pug">
  v-card.my-2(
    :class="colorOptions.classNames"
    :dark="colorOptions.dark"
    v-if="mode === 'dice'"
  )
    v-card-title.caption.px-2.pt-2.pb-0 {{node.dice}}
    v-card-text.pa-2 {{node.text}}
  v-card.my-2(v-else-if="mode === 'memoOpen'")
    v-card-title.caption.px-2.pt-2.pb-0
      v-icon mdi-note
      span {{node.title}}
    v-card-text.pa-2 {{node.text}}
  div(v-else-if="mode === 'youtube'")
    message-body-node-youtube-player(:video-id="youtubeId")
  div(v-else-if="mode === 'link'")
    iframe(:src="`https://hatenablog-parts.com/embed?url=${uriEncodedText}`")
    //- a(:href="node.text" target="_blank") {{node.text}}
  div(v-else) {{node.text}}
</template>

<style lang="stylus" scoped>
iframe
  border none
  width 100%
</style>

<script>
import getYoutubeId from 'get-youtube-id';
import isUrl from 'is-url';
import MessageBodyNodeYoutubePlayer from '@/browser/components/MessageBodyNodeYoutubePlayer.vue';

export default {
  components: {
    MessageBodyNodeYoutubePlayer,
  },
  computed: {
    colorOptions() {
      const { node } = this;

      if (node.type === 'dice') {
        if (node.text.match(/成功$/)) return { classNames: { green: true }, dark: true };
        if (node.text.match(/失敗$/)) return { classNames: { red: true }, dark: true };
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
    mode() {
      if (this.node.type === 'dice') return 'dice';
      if (this.node.type === 'memoOpen') return 'memoOpen';
      if (this.youtubeId) return 'youtube';
      if (this.isurl) return 'link';
      return 'text';
    },
  },
  data() {
    return {
      play: Date.now() - this.createdAt < 1000 * 30,
    };
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
