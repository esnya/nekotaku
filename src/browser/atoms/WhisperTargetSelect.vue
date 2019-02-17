<template lang="pug">
  v-select(
    hide-details
    chips
    multiple
    label="秘話設定"
    :items="items"
    :value="value"
    @input="onInput"
  )
</template>

<script>
import map from 'lodash/map';
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(Array, false)],
  computed: {
    items() {
      return map(this.members, v => v.name).filter(a => a);
    },
  },
  props: {
    members: {
      required: true,
      type: Object,
    },
  },
};
</script>
