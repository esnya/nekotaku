<template lang="pug">
  v-chip(close @input="onInput") {{name}}
</template>

<script>
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(Boolean, true)],
  props: {
    name: {
      required: true,
      type: String,
    },
  },
};
</script>
