<template lang="pug">
  v-card
    v-divider
    v-card-text.py-1
      form.chat-form(@submit.prevent="submit")
        v-menu
          v-btn.my-0(icon,slot="activator")
            v-icon keyboard_arrow_up
          v-list
            v-list-tile
              v-list-tile-title ありす
            v-list-tile
              v-list-tile-title ぼぶ
            v-list-tile
              v-list-tile-title ちゃーりー
        v-text-field.chat-message(
          multi-line
          v-model="body"
          :label="name"
          :hide-details="true"
          :rows="bodyRows"
          @keypress.enter="enter"
        )
        v-btn.my-0.pl-1(icon,primary,dark, @click="submit")
          v-icon send
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      body: null,
      face: 'default',
      name: 'ありす',
    };
  },
  computed: {
    bodyRows() {
      return Math.max(1, this.body ? this.body.split(/\n/g).length : 1);
    },
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
      } = this;
      if (!body) return;

      this.body = null;

      this.sendMessage({ name, face, body });
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
  .chat-form
    display: flex;
    align-items: flex-end;

    .chat-form
      flex: 1 1 auto;
</style>
