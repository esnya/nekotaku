<template lang="pug">
  v-dialog(v-model="open")
    v-card(v-scroll="'y'")
      v-card-title
        span.headline {{welcomeMessage.title}}
      v-card-text.pb-0
        div(v-for="line in welcomeMessage.body") {{line}}
        v-checkbox(
          label="次回から表示しない。"
          v-model="dontShowAgain"
          v-if="!welcomeMessage.forceVisible"
        )
      v-card-actions
        v-spacer
        v-btn(color="primary" @click="open = false") 閉じる
</template>

<script>
import config from '../config';

const StorageKey = 'nekotaku:welco-memessage:hidden-id';

function getDontShowAgain() {
  return localStorage.getItem(StorageKey) === config.welcomeMessage.id;
}

export default {
  computed: {
    welcomeMessage: () => config.welcomeMessage,
    dontShowAgain: {
      get: getDontShowAgain,
      set(b) {
        if (b) localStorage.setItem(StorageKey, config.welcomeMessage.id);
        else localStorage.removeItem(StorageKey);
      },
    },
  },
  data() {
    return {
      open: config.welcomeMessage.forceVisible || !getDontShowAgain(),
    };
  },
};
</script>
