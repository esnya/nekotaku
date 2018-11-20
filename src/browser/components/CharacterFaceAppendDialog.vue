<template lang="pug">
  v-dialog(v-model="dialog")
    v-btn(icon slot="activator")
      v-icon add
    v-card
      v-card-title(primary-title)
        span.headline 表情の追加
      v-card-text
        v-text-field(
          full-width
          name="face"
          label="表情の名前"
          v-model="value"
        )
      v-card-actions
        v-spacer
        v-btn.primary(@click="append") 追加
        v-btn(@click="close") キャンセル
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      value: null,
    };
  },
  methods: {
    append() {
      this.close();
      this.$emit('input', this.value);
      this.value = null;
    },
    close() {
      this.dialog = false;
    },
  },
};
</script>
