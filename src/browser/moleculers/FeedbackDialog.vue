<template lang="pug">
  simple-dialog(title="フィードバック" :container="false" :value="value" @input="v => $emit('input', v)")
    v-card-text
      span Issue/Pull Request大歓迎です。GitHubアカウントをお持ちの方は
      a(href="https://github.com/ukatama/nekotaku/issues" target="_blank") こちら
      span から作成して下さい。
    v-card-text
      a(:href="feedbackFormURL" target="_blank") こちらのフォーム
      span もご利用下さい。GitHubアカウントのない方でもご意見・ご要望・不具合報告などをご送信いただけます。
</template>

<script>
import SimpleDialog from '@/browser/moleculers/SimpleDialog.vue';
import config from '@/browser/config';

export default {
  components: {
    SimpleDialog,
  },
  data() {
    return {
      feedbackFormURL: config.feedbackFormURL,
    };
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
