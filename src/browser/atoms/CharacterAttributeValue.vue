<template lang="pug">
  div {{character.attributes[index]}}
</template>

<script>
export default {
  props: {
    index: {
      required: true,
      type: Number,
    },
    character: {
      required: true,
      type: Object,
    },
  },
};
</script>
