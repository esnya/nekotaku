<template lang="pug">
  v-card.pb-2.chat-control
    v-divider
    v-card-text.py-0.neko-flex-row.align-end
      chat-config-dialog
      v-text-field.neko-flex.message-body(
        multi-line
        v-model="body"
        :label="name"
        :hide-details="true"
        :rows="bodyRows"
        :style="{ color }"
        @keypress.enter="enter"
      )
      v-btn.my-0.pl-1(icon,primary,dark, @click="submit")
        v-icon send
</template>

<script>
import Palette from 'google-material-color';
import { mapActions, mapState } from 'vuex';
import ChatConfigDialog from './ChatConfigDialog.vue';

export default {
  components: {
    ChatConfigDialog,
  },
  computed: {
    ...mapState([
      'chatControl',
    ]),
    bodyRows() {
      return Math.max(1, this.body ? this.body.split(/\n/g).length : 1);
    },
    color() {
      return Palette.get(...this.chatControl.color) || Palette.get(this.chatControl.color[0]);
    },
    name() {
      return this.chatControl.name;
    },
  },
  data() {
    return {
      body: null,
      face: 'default',
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
        color,
      } = this;
      if (!body) return;

      this.body = null;

      this.sendMessage({ color, name, face, body });
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
.chat-control
  .message-body
    :global(textarea)
    :global(label)
      color inherit !important

    :global(label)
      opacity 0.45

    &.input-group--focused :global(label)
      opacity 1
</style>
