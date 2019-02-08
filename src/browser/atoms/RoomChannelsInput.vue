<template lang="pug">
  text-array-input(
    required
    label="チャットチャンネル"
    name="roomChannels"
    placeholder="例: メイン,雑談"
    :value="value"
    @input="$emit('input', $event)"
  )
</template>

<script>
import TextArrayInput from '@/browser/electrons/TextArrayInput.vue';

export default {
  components: {
    TextArrayInput,
  },
  props: {
    value: {
      required: false,
      type: Array,
    },
  },
};
</script>
