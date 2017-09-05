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
          autocomplete
          label="ダイス"
          item-text="gameType"
          item-value="filename"
          :items="diceBotDescs"
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
      diceBotDescs: [{ filename: 'DiceBot', gameType: 'DiceBot' }],
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
