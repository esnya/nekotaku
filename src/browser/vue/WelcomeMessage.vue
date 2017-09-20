<template lang="pug">
  v-dialog(v-model="open")
    v-card(v-scroll="'y'")
      v-card-title
        span.headline {{title}}
      v-card-text.pb-0
        div(v-for="line in body") {{line}}
        v-checkbox(label="次回から表示しない。", v-model="dontShowAgain")
      v-card-actions
        v-spacer
        v-btn(primary, @click="open = false") 閉じる
</template>

<script>
import config from '../config';

const StorageKey = 'nekotaku:welco-memessage:hidden-id';

export default {
  data() {
    return {
      id: null,
      title: null,
      body: [],
      ...config.welcomeMessage,

      open: config.welcomeMessage && localStorage.getItem(StorageKey) !== config.welcomeMessage.id,
      dontShowAgain: false,
    };
  },
  watch: {
    dontShowAgain(b) {
      if (b) localStorage.setItem(StorageKey, this.id);
      else localStorage.removeItem(StorageKey);
    },
  },
};
</script>

