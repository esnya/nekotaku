<template lang="pug">
  v-select(
    required
    label="ダイスの種類"
    item-text="gameName"
    item-value="filename"
    :items="diceBotDescs"
    :rules="[notEmpty]"
    :value="value"
    @input="$emit('input', $event)"
  )
</template>

<script>
import { getDiceBotDescs } from '../utilities/bcdice';

export default {
  data() {
    return {
      diceBotDescs: getDiceBotDescs(),
    };
  },
  methods: {
    notEmpty(v) {
      return v ? true : '入力して下さい。';
    },
  },
  props: {
    value: {
      type: String,
      required: false,
      default: null,
    },
  },
};
</script>

