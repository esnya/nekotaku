<template lang="pug">
  v-dialog(v-model="open")
    v-btn.btn-create-room.primary(fab, dark, slot="activator")
      v-icon add
    v-card
      v-card-title
        span.headline 卓作成
      v-card-text
        v-form(v-model="valid", @submit.prevent="submit")
          v-text-field(
            label="タイトル"
            v-model="data.title"
            :rules="titleRules"
            required
          )
          v-select(
            label="ダイス"
            :items="['DiceBot','Cthulhu7th','SwordWorld2.0']"
            v-model="data.dice"
          )
          v-text-field(
            label="キャラクター属性"
            placeholder="例: HP,MP,SP"
            v-model="data.characterAttributes"
          )
          <small>*必須項目</small>
      v-card-actions
        v-spacer
        v-btn.primary(:disabled="!valid",@click="submit") 作成
        v-btn(@click.native="open = false") キャンセル
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      open: false,
      valid: false,
      titleRules: [
        v => !!v || 'タイトルを入力して下さい',
      ],
      data: {
        title: null,
        dice: null,
        characterAttributes: null,
      },
    };
  },
  methods: {
    ...mapActions([
      'createRoom',
    ]),
    submit() {
      if (!this.valid) return;

      const {
        title,
        dice,
        characterAttributes,
      } = this.data;

      this.createRoom({
        title,
        dice: dice || 'DiceBot',
        characterAttributes: characterAttributes ? characterAttributes.split(',') : [],
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
