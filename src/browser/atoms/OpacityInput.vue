<template lang="pug">
  div
    div.caption {{label}}
    v-slider(:min="0" :max="100" :value="value" @input="$emit('input', Number($event))")
</template>

<script>
export default {
  props: {
    label: {
      required: true,
      type: String,
    },
    value: {
      required: true,
      type: Number,
    },
  },
};
</script>
