<template lang="pug">
  v-dialog(:value="value" @input="v => $emit('input', v)")
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
        v-btn(@click="$emit('input', false)") 閉じる
</template>

<script>
import { mapActions, mapState } from 'vuex';
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
  methods: mapActions([
    'setChatColor',
    'setChatName',
  ]),
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
