<template lang="pug">
  v-dialog(
    scrollable
    :value="value"
    @input="onInput"
  )
    v-card
      v-card-title.headline(v-if="title") {{title}}
      v-card-text(v-if="container")
        slot
      slot(v-else)
      v-card-actions
        v-spacer
        slot(name="actions")
</template>

<script>
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(Boolean, true)],
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
