<template lang="pug">
  v-dialog(:value="value" @input="v => $emit('input', v)")
    v-card
      v-card-title.headline フィードバック
      v-card-text
        span Issue/Pull Request大歓迎です。GitHubアカウントをお持ちの方は
        a(href="https://github.com/ukatama/nekotaku/issues" target="_blank") こちら
        span から作成して下さい。
      v-card-text
        a(:href="feedbackFormURL" target="_blank") こちらのフォーム
        span もご利用下さい。GitHubアカウントのない方でもご意見・ご要望・不具合報告などをご送信いただけます。
      v-card-actions
        v-spacer
        v-btn(color="primary" @click="$emit('input', false)") 閉じる
</template>

<script>
import config from '../config';

export default {
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
