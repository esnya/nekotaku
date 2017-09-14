<template lang="pug">
  v-dialog(:value="value", @input="v => $emit('input', v)")
    v-card(v-scroll="'y'")
      v-card-title
        span.headline パスワード設定
      v-card-text
        v-form(v-model="valid", @submit.prevent="submit")
          v-text-field(
            v-model="password"
            required
            label="新しいパスワード"
            type="password"
            :rules="[notEmpty]"
          )
          v-text-field(
            v-model="passwordConfirm"
            required
            label="パスワードの確認"
            type="password"
            :rules="[notEmpty, equal]"
          )
      v-card-actions
        v-spacer
        v-btn.primary(:disabled="!valid", @click="submit") 設定
        v-btn(@click="close") キャンセル
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      password: null,
      passwordConfirm: null,
      valid: false,
    };
  },
  methods: {
    ...mapActions([
      'updateRoomPassword',
    ]),
    notEmpty(v) {
      return v ? true : 'パスワードを入力して下さい。';
    },
    equal(v) {
      return v === this.password ? true : 'パスワードが一致しません。';
    },
    close() {
      this.$emit('input', false);
    },
    submit() {
      this.close();
      this.updateRoomPassword(this.password);
    },
  },
  props: [
    'value',
  ],
};
</script>
