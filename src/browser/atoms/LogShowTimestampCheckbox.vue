<template lang="pug">
  v-checkbox(
    label="日時を含める"
    :disabled="type === 'json'"
    :value="value"
    @change="onInput(Boolean($event))"
  )
</template>

<script>
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(Boolean, true)],
  props: {
    type: {
      required: true,
      type: String,
    },
  },
};
</script>
