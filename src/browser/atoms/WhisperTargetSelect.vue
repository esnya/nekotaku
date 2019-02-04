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
import _ from 'lodash';
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(Array, false)],
  computed: {
    items() {
      return _.map(this.members, v => v.name);
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
