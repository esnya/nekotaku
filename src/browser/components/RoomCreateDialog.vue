<template lang="pug">
  v-dialog(v-model="open")
    v-btn(
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
        form(@submit.prevent="submit")
          v-text-field(
            required
            label="タイトル"
            name="title"
            :error-messages="errors.collect('title')"
            v-model="title"
            v-validate="'required'"
          )
          dice-select(
            v-model="dice"
          )
        form(@submit.prevent="submit")
          v-text-field(
            label="パスワード"
            name="password"
            placeholder="空欄で公開卓"
            type="password"
            :error-messages="errors.collect('password')"
            v-model="password"
          )
          transition(name="neko-field")
            v-text-field(
              required
              name="passwordConfirm"
              label="パスワード確認"
              type="password"
              :error-messages="errors.collect('passwordConfirm')"
              v-if="password"
              v-model="passwordConfirm"
              v-validate="{ required: true, is: password }"
            )
          v-text-field(
            name="characterAttributes"
            label="キャラクター属性"
            placeholder="例: HP,MP,SP"
            :error-messages="errors.collect('characterAttributes')"
            v-model="characterAttributes"
          )
      v-card-actions
        v-spacer
        v-btn(
          color="primary"
          @click="submit"
        ) 作成
        v-btn(@click.native="open = false") キャンセル
</template>

<script>
import DiceSelect from '@/browser/components/DiceSelect.vue';

export default {
  components: {
    DiceSelect,
  },
  data() {
    return {
      open: false,
      title: null,
      dice: 'DiceBot',
      characterAttributes: null,
      password: null,
      passwordConfirm: null,
    };
  },
  methods: {
    async submit() {
      if (!await this.$validator.validateAll()) return;

      const {
        title,
        dice,
        characterAttributes,
        password,
      } = this;

      this.$models.rooms.push({
        title,
        dice,
        characterAttributes,
        password,
      });
    },
  },
};
</script>
