<template lang="pug">
  v-dialog(:value="value" @input="v => $emit('input', v)")
    v-card(v-scroll="'y'")
      v-card-title
        span.headline チャット設定
      v-tabs(
        light
        :value="chatConfigList.findIndex(c => c.id === selectedChatId)"
        @change="selectChatConfig(chatConfigList[$event].id)"
      )
        v-tabs-slider(color="primary")
        v-tab(
          :key="config.key"
          :style="{ color: config.color }"
          v-for="config in chatConfigList"
        ) {{config.name}}
        v-btn(
          icon
          @click="addChatConfig"
        )
          v-icon add
        v-btn(
          icon
          :disabled="chatConfigList.length <= 1"
          @click="removeChatConfig"
        )
          v-icon delete
      v-card-text.pb-0
        v-text-field(
          required
          label="名前"
          :color="chatControl.color"
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
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    Compact,
  },
  computed: {
    ...mapGetters([
      'chatControl',
      'chatConfigList',
      'selectedChatId',
    ]),
  },
  methods: mapActions([
    'addChatConfig',
    'removeChatConfig',
    'selectChatConfig',
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
