<template lang="pug">
  v-dialog(v-model="open")
    v-btn(
      dark
      fab
      fixed
      bottom right
      color="primary"
      slot="activator"
    )
      v-icon add
    v-card(v-scroll="'y'")
      v-card-title
        span.headline 卓作成
      v-card-text
        v-form(v-model="valid", @submit.prevent="submit")
          v-text-field(
            label="タイトル"
            v-model="title"
            :rules="[notEmpty]"
            required
          )
          dice-select(v-model="dice")
        form(@submit.prevent="submit")
          v-text-field(
            label="パスワード"
            placeholder="空欄で公開卓"
            type="password"
            v-model="password"
          )
          transition(name="neko-field")
            v-text-field(
              required
              label="パスワード確認"
              type="password"
              :rules="[notEmpty, passwordConfirmRule]"
              v-if="password"
              v-model="passwordConfirm"
            )
          v-text-field(
            label="キャラクター属性"
            placeholder="例: HP,MP,SP"
            v-model="characterAttributes"
          )
      v-card-actions
        v-spacer
        v-btn(color="primary" :disabled="!canSubmit",@click="submit") 作成
        v-btn(@click.native="open = false") キャンセル
</template>

<script>
import { mapActions } from 'vuex';
import DiceSelect from './DiceSelect.vue';

export default {
  components: {
    DiceSelect,
  },
  computed: {
    canSubmit() {
      return this.valid && (!this.password || this.password === this.passwordConfirm);
    },
  },
  data() {
    return {
      open: false,
      valid: false,
      title: null,
      dice: 'DiceBot',
      characterAttributes: null,
      password: null,
      passwordConfirm: null,
    };
  },
  methods: {
    ...mapActions([
      'createRoom',
    ]),
    notEmpty(v) {
      return v ? true : '入力して下さい。';
    },
    passwordConfirmRule(v) {
      if (!this.password) return true;

      return this.password === v ? true : '確認パスワードが一致しません。';
    },
    submit() {
      if (!this.canSubmit) return;

      const {
        title,
        dice,
        characterAttributes,
        password,
      } = this;

      this.createRoom({
        title,
        dice,
        characterAttributes: characterAttributes ? characterAttributes.split(',') : [],
        password,
        router: this.$router,
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.btn-create-room
  position: absolute;
  right: 16px;
  bottom: 16px;
</style>
