<template lang="pug">
  bottom-control
    chat-message-input(:configuration="chatConfig" :to="whisperTargets" @submit="submitMessage")
    more-icon-button(@click="actionDialog = true")
    chat-action-dialog(:members="members" :room="room" v-model="actionDialog")
</template>

<script>
import { mapGetters } from 'vuex';
import BottomControl from '@/browser/atoms/BottomControl.vue';
import ChatMessageInput from '@/browser/atoms/ChatMessageInput.vue';
import MoreIconButton from '@/browser/atoms/MoreIconButton.vue';
import ChatActionDialog from '@/browser/organisims/ChatActionDialog.vue';

export default {
  computed: {
    ...mapGetters([
      'chatConfig',
      'whisperTargets',
    ]),
  },
  components: {
    BottomControl,
    ChatActionDialog,
    ChatMessageInput,
    MoreIconButton,
  },
  data: () => ({
    actionDialog: false,
  }),
  methods: {
    submitMessage(body) {
      const {
        face,
        to,
      } = this;

      const {
        name,
        color,
      } = this.chatConfig;

      const {
        dice,
      } = this.room;


      this.$models.messages.push(this.roomId, {
        body,
        color,
        dice,
        face,
        name,
        to,
      });
    },
  },
  props: {
    members: {
      required: true,
      type: Object,
    },
    room: {
      required: true,
      type: Object,
    },
  },
};
</script>

<style lang="stylus" scoped>
.neko-chat-toolbar
  position fixed
  bottom 56px
  width 100%
  background-color white
</style>
