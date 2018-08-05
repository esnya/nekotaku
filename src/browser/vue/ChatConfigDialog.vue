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
        compact(
          :value="chatControl.color"
          @input="setChatColor($event.hex)"
        )
      v-card-actions
        v-spacer
        v-btn(@click="$emit('input', false)") 閉じる
</template>

<script>
import { Compact } from 'vue-color';
import { mapActions, mapState } from 'vuex';

export default {
  components: {
    Compact,
  },
  computed: mapState([
    'chatControl',
  ]),
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
