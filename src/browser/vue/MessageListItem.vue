<template lang="pug">
  v-card.elevation-1.my-2(:style="styles.container", ref="root")
    v-card-title.px-2.pt-2.pb-1
      div {{message.name}}
      v-spacer
      from-now.caption(:time="message.createdAt")
    v-divider
    v-card-text.pa-2
      message-body(:nodes="message.body")
</template>

<script>
import { inOutSign } from 'ease-component';
import scroll from 'scroll';
import playNoticeSound from '../utilities/noticeSound';
import FromNow from './FromNow.vue';
import MessageBody from './MessageBody.vue';

export default {
  components: {
    FromNow,
    MessageBody,
  },
  computed: {
    styles() {
      return {
        container: {
          color: this.message.color,
        },
      };
    },
  },
  props: [
    'message',
  ],
  created() {
    if (Date.now() - this.message.createdAt < 1000) {
      playNoticeSound();
    }
  },
  mounted() {
    const item = this.$refs.root;
    const scrollable = item.closest('.neko-scroll');
    const prev = item.previousElementSibling;

    if (prev && prev.offsetTop < scrollable.scrollTop + scrollable.offsetHeight) {
      const scrollTo = (item.offsetTop + item.offsetHeight + 8) - scrollable.offsetHeight;

      if (scrollTo > scrollable.scrollTop) {
        if (Date.now() - this.message.createdAt < 1000) {
          scroll.top(scrollable, scrollTo, { duration: 400, ease: inOutSign });
        } else {
          scrollable.scrollTop = scrollTo;
        }
      }
    }
  },
};
</script>
