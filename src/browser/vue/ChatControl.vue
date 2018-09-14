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
          v-list-tile(@click="cwdOpen = true")
            v-list-tile-action
              v-icon mdi-account-multiple
            v-list-tile-content
              v-list-tile-title 秘匿チャット
      v-flex
        v-textarea.message-body(
          hide-details
          v-model="body"
          :color="chatControl.color"
          :label="to ? `㊙ ${name} >> ${to}` : name"
          :hide-details="true"
          :rows="bodyRows"
          :style="{ color: chatControl.color }"
          @keypress.enter="enter"
        )
      v-btn.my-0.pl-1(icon color="primary" dark  @click="submit")
        v-icon send
    chat-config-dialog(v-model="ccdOpen")
    chat-palette-dialog(v-model="cpdOpen")
    v-dialog(v-model="cwdOpen")
      v-card
        v-card-title(primary-title)
          span.headline 秘匿チャット
        v-card-text
          v-text-field(
            name="to"
            label="宛先"
            hint="空欄で公開チャット / ,(カンマ)区切りで複数対象"
            v-model="to"
          )
        v-card-actions
          v-spacer
          v-btn(@click="cwdOpen = false") 閉じる
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
      to: null,
      ccdOpen: false,
      cpdOpen: false,
      cwdOpen: false,
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

      const to = this.to ? this.to.split(/\s*,\s*/) : null;

      this.sendMessage({
        color: chatControl.color,
        name,
        face,
        body,
        to,
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
