<template lang="pug">
  card-dialog(
    :title="title"
    :value="value"
    @input="onInput"
  )
    slot
    template(slot="actions")
      close-button(@click="close")
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
    title: {
      required: false,
      type: String,
    },
  },
};
</script>
