<template lang="pug">
  v-dialog(:value="value", @input="v => $emit('input', v)")
    v-card(v-scroll="'y'")
      v-card-title
        span.headline パスワード解除
      v-card-text
        div パスワードを解除しますか？
        div 誰でも卓に入れるようになります。
      v-card-actions
        v-spacer
        v-btn.warning(@click="clear") 解除
        v-btn(@click="close") キャンセル
</template>

<script>
export default {
  methods: {
    async clear() {
      this.close();
      await this.$models.room.update(this.roomId, { password: undefined });
    },
    close() {
      this.$emit('input', false);
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
