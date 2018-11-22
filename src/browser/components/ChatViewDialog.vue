<template lang="pug">
  v-dialog(:value="value" @input="$emit('input', $event)")
    v-card
      v-card-title.headline 表示設定
      v-card-text
        form(@submit.prevent)
          v-text-field(
            required
            label="チャット表示件数"
            name="messagesLimit"
            type="number"
            :value="messagesLimit || 100"
            @input="setMessagesLimit(Number($event))"
          )
      v-card-actions
        v-spacer
        v-btn(color="primary" @click="$emit('input', false)") 閉じる
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: mapGetters([
    'messagesLimit',
  ]),
  methods: mapActions([
    'setMessagesLimit',
  ]),
  props: {
    value: {
      required: true,
      type: Boolean,
    },
  },
};
</script>
