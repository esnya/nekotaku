<template lang="pug">
  v-dialog(v-model="open")
    v-card(v-if="room")
      v-card-title
        span.headline 卓設定
      v-card-text
        v-text-field(
          required
          label="タイトル"
          v-model="title"
        )
        v-select(
          autocomplete
          required
          label="ダイスの種類"
          item-text="gameType"
          item-value="filename"
          v-model="dice"
          :items="diceBotDescs"
        )
        v-text-field(
          label="キャラクター属性"
          placeholder="例: HP,MP,SP"
          v-model="characterAttributes"
        )
      v-card-actions
        v-spacer
        v-btn(@click="open = false") 閉じる
    v-card(v-else)
      loading
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Loading from './Loading.vue';

function genInputValue(key) {
  return {
    get() {
      return this.room[key];
    },
    set(value) {
      this.updateRoom({ key, value });
    },
  };
}

export default {
  components: {
    Loading,
  },
  data() {
    return {
      diceBotDescs: [{ filename: 'DiceBot', gameType: 'DiceBot' }],
      mapSizeRules: [
        v => Boolean(v) || '幅・高さを入力して下さい',
        v => Boolean(`${v}`.match(/^[1-9][0-9]*$/)) || '1以上の数値を入力して下さい',
      ],
    };
  },
  computed: {
    ...mapState([
      'room',
    ]),
    open: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit('input', newValue);
      },
    },
    title: genInputValue('title'),
    dice: genInputValue('dice'),
    characterAttributes: {
      get() {
        return this.room.characterAttributes ? this.room.characterAttributes.join(',') : null;
      },
      set(newValue) {
        this.updateRoom({
          key: 'characterAttributes',
          value: newValue ? newValue.split(',') : [],
        });
      },
    },
  },
  methods: mapActions([
    'updateRoom',
  ]),
  props: [
    'value',
  ],
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
