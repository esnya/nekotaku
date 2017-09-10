<template lang="pug">
  v-dialog(:value="value", @input="v => $emit('input', v)")
    v-card
      v-card-title
        span.hadline 卓の削除
      v-card-text
        div 卓を削除しますか？
        div ※元には戻せません。
      v-card-actions
        v-spacer
        v-btn(error, @click="() => { close(); removeRoom($router); }") 削除
        v-btn(@click="close") やめる
</template>

<script>
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions([
      'removeRoom',
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

