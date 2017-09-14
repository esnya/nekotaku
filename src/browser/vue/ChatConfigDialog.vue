<template lang="pug">
  v-dialog(v-model="open")
    v-btn.ml-0.mr-1.my-0(icon, slot="activator")
      v-icon mdi-message-settings-variant
    v-card(v-scroll="'y'")
      v-card-title
        span.headline チャット設定
      v-card-text.pb-0
        v-text-field(
          required
          label="名前"
          :value="chatControl.name"
          @input="setChatName"
        )
      v-card-text
        div.mb-1 文字色
        material-color-selector(
          required
          :value="chatControl.color"
          @input="setChatColor"
        )
      v-card-actions
        v-spacer
        v-btn(@click="open = false") 閉じる
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import MaterialColorSelector from './MaterialColorSelector.vue';

export default {
  components: {
    MaterialColorSelector,
  },
  computed: mapState([
    'chatControl',
  ]),
  data() {
    return {
      open: false,
    };
  },
  methods: mapMutations([
    'setChatColor',
    'setChatName',
  ]),
};
</script>
