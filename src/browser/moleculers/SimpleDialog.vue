<template lang="pug">
  card-dialog(
    :container="container"
    :title="title"
    :value="value"
    @input="onInput"
  )
    slot
    template(slot="actions")
      close-button(color="primary" @click="close")
</template>

<script>
import CardDialog from '@/browser/atoms/CardDialog.vue';
import CloseButton from '@/browser/atoms/CloseButton.vue';
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(Boolean, true)],
  components: {
    CloseButton,
    CardDialog,
  },
  methods: {
    close() {
      this.onInput(false);
    },
  },
  props: {
    container: {
      default: true,
      required: false,
      type: Boolean,
    },
    title: {
      required: false,
      type: String,
    },
  },
};
</script>
