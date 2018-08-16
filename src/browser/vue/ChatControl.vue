<template lang="pug">
  v-card.pb-2.room-tab-control
    v-layout(row align-end)
      v-menu(top offset-y transition="slide-y-reverse-transition")
        v-btn.my-0(icon slot="activator")
          v-icon more_vert
        v-list
          v-list-tile(@click="cpdOpen = true")
            v-list-tile-action
              v-icon palette
            v-list-tile-content
              v-list-tile-title チャットパレット
          v-list-tile(@click="ccdOpen = true")
            v-list-tile-action
              v-icon mdi-message-settings-variant
            v-list-tile-content
              v-list-tile-title チャット設定
      v-flex
        v-textarea.message-body(
          hide-details
          v-model="body"
          :color="chatControl.color"
          :label="name"
          :hide-details="true"
          :rows="bodyRows"
          :style="{ color: chatControl.color }"
          @keypress.enter="enter"
        )
      v-btn.my-0.pl-1(icon color="primary" dark  @click="submit")
        v-icon send
    chat-config-dialog(v-model="ccdOpen")
    chat-palette-dialog(v-model="cpdOpen")
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ChatConfigDialog from './ChatConfigDialog.vue';
import ChatPaletteDialog from './ChatPaletteDialog.vue';

export default {
  components: {
    ChatConfigDialog,
    ChatPaletteDialog,
  },
  computed: {
    ...mapGetters([
      'chatControl',
    ]),
    bodyRows() {
      return Math.max(1, this.body ? this.body.split(/\n/g).length : 1);
    },
    name() {
      return this.chatControl.name;
    },
  },
  data() {
    return {
      body: null,
      face: 'default',
      ccdOpen: false,
      cpdOpen: false,
    };
  },
  methods: {
    ...mapActions([
      'sendMessage',
    ]),
    submit() {
      const {
        body,
        face,
        name,
        chatControl,
      } = this;
      if (!body) return;

      this.body = null;

      this.sendMessage({
        color: chatControl.color,
        name,
        face,
        body,
      });
    },
    enter(e) {
      if (e.shiftKey) return;

      e.preventDefault();
      this.submit();
    },
  },
};
</script>

<style lang="stylus" scoped>
.message-body
  :global(textarea)
  :global(label)
    color inherit !important

  :global(label)
    opacity 0.45

  &.input-group--focused :global(label)
    opacity 1

  &.primary--text
    color unset !important
</style>
