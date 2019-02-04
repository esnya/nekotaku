<template lang="pug">
  v-bottom-sheet(
    :value="value"
    @input="onInput"
  )
    v-card
      v-card-title(v-if="title")
        div.headline {{title}}
        v-spacer
        close-button(@click="onInput(false)")
      v-layout(v-else)
        v-spacer
        close-button(@click="onInput(false)")
      v-card-text(v-if="container")
        slot
      slot(v-else)
</template>

<script>
import CardDialog from '@/browser/atoms/CardDialog.vue';
import CloseButton from '@/browser/atoms/CloseIconButton.vue';
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
      required: false,
      type: Boolean,
      default: true,
    },
    title: {
      required: false,
      type: String,
    },
  },
};
</script>
