<template lang="pug">
  text-array-input(
    required
    label="キャラクター属性(,区切り)"
    name="characterAttributeTypes"
    placeholder="例: HP,MP,SP"
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
