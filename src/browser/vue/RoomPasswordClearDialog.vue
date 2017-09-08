<template lang="pug">
  v-dialog(:value="value", @input="v => $emit('input', v)")
    v-card
      v-card-title
        span.headline パスワード解除
      v-card-text
        div パスワードを解除しますか？
        div 誰でも卓に入れるようになります。
      v-card-actions
        v-spacer
        v-btn.warning(@click="() => { this.close(); clearRoomPassword(); }") 解除
        v-btn(@click="close") キャンセル
</template>

<script>
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions([
      'clearRoomPassword',
    ]),
    close() {
      this.$emit('input', false);
    },
  },
  props: [
    'value',
  ],
};
</script>
