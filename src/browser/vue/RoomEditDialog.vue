<template lang="pug">
  v-dialog(v-model="open")
    v-card(v-if="room")
      v-card-title
        span.headline 卓設定
      v-card-text
        v-text-field(
          label="タイトル"
          v-model="title"
          :rules="titleRules"
          required
        )
        v-select(
          label="ダイス"
          :items="diceNames"
          v-model="dice"
        )
        v-text-field(
          label="キャラクター属性"
          placeholder="例: HP,MP,SP"
          v-model="characterAttributes"
        )
      v-card-actions
        v-spacer
        v-btn.primary(@click="open = false") 閉じる
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
      diceNames: ['DiceBot'],
      valid: true,
      titleRules: [
        v => Boolean(v) || 'タイトルを入力して下さい',
      ],
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
        this.onRequestChangeState(newValue);
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
    'onRequestChangeState',
  ],
  created() {
    import('../utilities/bcdice').then(({ getGameTypes }) => {
      this.diceNames = getGameTypes();
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
