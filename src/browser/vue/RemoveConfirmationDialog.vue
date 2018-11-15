<template lang="pug">
  v-dialog(v-model="dialog")
    v-btn(icon slot="activator" :disabled="disabled")
      v-icon delete
    v-card
      v-card-title
        span.headline 削除
      v-card-text 削除すると元に戻せません。削除してよろしいですか？
      v-card-actions
        v-spacer
        v-btn.error(@click="remove") 削除
        v-btn(@click="close") キャンセル
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    remove() {
      this.close();
      this.$emit('remove');
    },
    close() {
      this.dialog = false;
    },
  },
  props: {
    disabled: Boolean,
  },
};
</script>
