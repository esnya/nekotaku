<template lang="pug">
  card-dialog(
    :title="title"
    :value="value"
    @input="onInput"
  )
    slot
    template(slot="actions")
      create-button(color="primary" :loading="creating" @click="$emit('create', $event)")
      close-button(@click="onInput(false)")
</template>

<script>
import CardDialog from '@/browser/atoms/CardDialog.vue';
import CreateButton from '@/browser/atoms/CreateButton.vue';
import CloseButton from '@/browser/atoms/CloseButton.vue';
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(Boolean, true)],
  components: {
    CreateButton,
    CloseButton,
    CardDialog,
  },
  props: {
    creating: {
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
