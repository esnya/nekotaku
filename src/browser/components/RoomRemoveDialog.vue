<template lang="pug">
  v-dialog(:value="value", @input="v => $emit('input', v)")
    v-card(v-scroll="'y'")
      v-card-title
        span.hadline 卓の削除
      v-card-text
        div 卓を削除しますか？
        div ※元には戻せません。
      v-card-actions
        v-spacer
        v-btn(color="error" @click="remove") 削除
        v-btn(@click="close") やめる
</template>

<script>
import * as RouteNames from '@/browser/constants/route';
import run from '@/browser/utilities/task';

export default {
  methods: {
    close() {
      this.$emit('input', false);
    },
    remove() {
      run(async () => {
        await this.$models.room.remove(this.roomId);
        this.close();
        this.$router.push({ name: RouteNames.Lobby });
      });
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
