<template lang="pug">
  card-dialog(
    :title="title"
    :value="value"
    @input="onInput"
  )
    slot
    template(slot="actions")
      add-button(@click="add")
      close-button(@click="close")
</template>

<script>
import AddButton from '@/browser/atoms/AddButton.vue';
import CardDialog from '@/browser/atoms/CardDialog.vue';
import CloseButton from '@/browser/atoms/CloseButton.vue';
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(Boolean, true)],
  components: {
    AddButton,
    CloseButton,
    CardDialog,
  },
  methods: {
    async add() {
      if (!await this.$validator.validateAll()) return;
      this.$emit('add');
    },
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
