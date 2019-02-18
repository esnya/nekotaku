<template lang="pug">
  simple-dialog(title="表示設定" :value="value" @input="$emit('input', $event)")
    messages-limit-input(:value="messagesLimit" @input="updateMessagesLimit")
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import MessagesLimitInput from '@/browser/atoms/MessagesLimitInput.vue';
import SimpleDialog from '@/browser/moleculers/SimpleDialog.vue';

export default {
  components: {
    MessagesLimitInput,
    SimpleDialog,
  },
  computed: mapGetters([
    'messagesLimit',
  ]),
  methods: mapActions([
    'updateMessagesLimit',
  ]),
  props: {
    value: {
      required: true,
      type: Boolean,
    },
  },
};
</script>
