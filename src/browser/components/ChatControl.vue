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
              v-list-tile-title 秘話チャット
          v-list-tile(@click="cfdOpen = true")
            v-list-tile-action
              v-icon mdi-emoticon
            v-list-tile-content
              v-list-tile-title 立ち絵表情
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
    chat-palette-dialog(:room="room" v-model="cpdOpen")
    v-dialog(v-model="cwdOpen")
      v-card
        v-card-title(primary-title)
          span.headline 秘話チャット
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
    v-dialog(v-model="cfdOpen")
      v-card
        v-card-title(primary-title)
          span.headline 立ち絵表情
        v-card-text
          v-select(
            :disabled="faces.length === 0"
            :items="faces"
            v-model="face"
          )
        v-card-actions
          v-spacer
          v-btn(@click="cfdOpen = false") 閉じる
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import ChatConfigDialog from '@/browser/components/ChatConfigDialog.vue';
import ChatPaletteDialog from '@/browser/components/ChatPaletteDialog.vue';

export default {
  components: {
    ChatConfigDialog,
    ChatPaletteDialog,
  },
  computed: {
    ...mapGetters([
      'chatControl',
    ]),
    ...mapState([
      'characters',
    ]),
    bodyRows() {
      return Math.max(1, this.body ? this.body.split(/\n/g).length : 1);
    },
    name() {
      return this.chatControl.name;
    },
    faces() {
      if (!this.characters) return [];

      const character = this.characters.find(c => c.name === this.name);
      if (!character) return [];

      return Object.keys(character.portrait || {});
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
      cfdOpen: false,
    };
  },
  methods: {
    async submit() {
      if (!this.body) return;

      const {
        face,
        name,
      } = this;
      const {
        color,
      } = this.chatControl;
      const {
        dice,
      } = this.room;

      const to = this.to ? this.to.split(/\s*,\s*/) : null;

      const {
        executeDice,
        getDiceBotDescByFilename,
      } = await import(/* webpackChunkName: "bcdice" */ '@/browser/utilities/bcdice');

      const {
        result,
        diceResults,
      } = await executeDice(this.body, dice);

      const diceBotDesc = getDiceBotDescByFilename(dice);

      const body = this.body.split(/\n/g).map(text => ({ type: 'text', text })).concat(result === '1' ? [] : [{
        type: 'dice',
        dice: diceBotDesc ? diceBotDesc.gameType : dice,
        text: result.replace(/^: /, ''),
        diceResults,
      }]);

      this.body = null;

      this.$models.messages.push(
        this.room.id,
        {
          color,
          name,
          face,
          body,
          to,
          createdAt: Date.now(),
        },
      );
    },
    enter(e) {
      if (e.shiftKey) return;

      e.preventDefault();
      this.submit();
    },
  },
  props: {
    room: {
      required: true,
      type: Object,
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
