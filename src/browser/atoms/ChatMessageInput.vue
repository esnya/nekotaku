<template lang="pug">
  v-textarea(
    hide-details
    :append-icon="appendIcon"
    :color="configuration.color"
    :label="label"
    :rows="rows"
    v-model="value"
    @click:append="() => submit()"
    @keypress.enter="enter"
  )
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapGetters(['chatMessage']),
    appendIcon() {
      return this.value ? 'send' : null;
    },
    label() {
      const {
        to,
      } = this;
      const {
        name,
      } = this.configuration;

      return to
        ? `[秘話] ${name} > ${to.join(' ')}`
        : name;
    },
    rows() {
      const rows = (this.value || '').split(/\n/g).length;
      if (rows === 0) return 1;
      return rows;
    },
    value: {
      get() {
        return this.chatMessage;
      },
      set(value) {
        this.updateChatMessage(value);
      },
    },
  },
  methods: {
    ...mapMutations(['updateChatMessage']),
    enter(e) {
      if (e.shiftKey) return;

      e.preventDefault();
      this.submit();
    },
    submit() {
      if (!this.value) return;
      this.$emit('submit', this.value);
      this.value = null;
    },
  },
  props: {
    configuration: {
      required: true,
      type: Object,
    },
    to: {
      required: false,
      type: Array,
    },
  },
};
</script>
