<template lang="pug">
  v-dialog(v-model="open")
    v-card(v-scroll="'y'" v-if="room")
      v-card-title
        span.headline 卓設定
      v-card-text
        v-text-field(
          required
          label="タイトル"
          v-model="title"
        )
        dice-select(v-model="dice")
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
import Loading from '@/browser/components/Loading.vue';
import DiceSelect from '@/browser/components/DiceSelect.vue';

function genInputValue(key) {
  return {
    get() {
      return this.room[key];
    },
    set(value) {
      this.$models.room.update(
        this.room.id,
        { [key]: value },
      );
    },
  };
}

export default {
  components: {
    Loading,
    DiceSelect,
  },
  data() {
    return {
      mapSizeRules: [
        v => Boolean(v) || '幅・高さを入力して下さい',
        v => Boolean(`${v}`.match(/^[1-9][0-9]*$/)) || '1以上の数値を入力して下さい',
      ],
    };
  },
  computed: {
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
        this.$models.room.update(
          this.room.id,
          { characterAttributes: newValue ? newValue.split(',') : [] },
        );
      },
    },
  },
  props: {
    room: {
      required: true,
      type: Object,
    },
    value: {
      required: true,
      type: Boolean,
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
