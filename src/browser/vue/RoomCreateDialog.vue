<template lang="pug">
  v-dialog(v-model="open")
    v-btn.primary(
      dark
      fab
      fixed
      bottom right
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
          v-select(
            autocomplete
            label="ダイスの種類"
            item-text="gameType"
            item-value="filename"
            :items="diceBotDescs"
            :rules="[notEmpty]"
            v-model="dice"
            required
          )
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
        v-btn.primary(:disabled="!canSubmit",@click="submit") 作成
        v-btn(@click.native="open = false") キャンセル
</template>

<script>
import { mapActions } from 'vuex';

export default {
  computed: {
    canSubmit() {
      return this.valid && (!this.password || this.password === this.passwordConfirm);
    },
  },
  data() {
    return {
      diceBotDescs: [{ filename: 'DiceBot', gameType: 'DiceBot' }],
      open: false,
      valid: false,
      title: null,
      dice: null,
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
  created() {
    import('../utilities/bcdice').then(({ getDiceBotDescs }) => {
      this.diceBotDescs = getDiceBotDescs();
    });
  },
};
</script>

<style lang="stylus" scoped>
.btn-create-room
  position: absolute;
  right: 16px;
  bottom: 16px;
</style>
