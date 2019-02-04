<template lang="pug">
  v-select(
    label="表情"
    :items="faces"
    :value="value"
    @input="onInput"
  )
</template>

<script>
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(String, true)],
  props: {
    faces: {
      required: true,
      type: Array,
    },
  },
};
</script>
