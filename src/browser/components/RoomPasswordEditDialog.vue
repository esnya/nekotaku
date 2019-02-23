<template lang="pug">
  v-dialog(:value="value", @input="v => $emit('input', v)")
    v-card(v-scroll="'y'")
      v-card-title
        span.headline パスワード設定
      v-card-text
        form(@submit.prevent="submit")
          v-text-field(
            required
            label="新しいパスワード"
            name="password"
            type="password"
            :error-messages="errors.collect('password')"
            v-model="password"
            v-validate="'required'"
          )
          v-text-field(
            required
            label="パスワードの確認"
            type="password"
            name="passwordConfirm"
            :error-messages="errors.collect('passwordConfirm')"
            v-model="passwordConfirm"
            v-validate="{ required: true, is: password }"
          )
      v-card-actions
        v-spacer
        v-btn(color="primary" @click="submit") 設定
        v-btn(@click="close") キャンセル
</template>

<script>
export default {
  data() {
    return {
      password: null,
      passwordConfirm: null,
    };
  },
  methods: {
    close() {
      this.$emit('input', false);
    },
    async submit() {
      if (!await this.$validator.validateAll()) return;

      const { password } = this;
      this.close();
      await roomDAO.update({ password });
    },
  },
  props: {
    value: {
      required: true,
      type: Boolean,
    },
  },
};
</script>
