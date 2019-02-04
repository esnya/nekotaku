<template lang="pug">
  div.mb-3
    div.caption.mb-1(v-if="label") {{label}}
    compact(:style="style" :value="value" @input="onInput($event.hex)")
</template>

<script>
import { Compact } from 'vue-color';
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(String, false)],
  components: {
    Compact,
  },
  computed: {
    style() {
      return {
        width: '100%',
      };
    },
  },
  props: {
    label: {
      type: String,
    },
    value: {
      required: false,
      type: String,
      default: '#000000',
    },
  },
};
</script>
