<template lang="pug">
  div {{character.name}}
</template>

<script>
export default {
  props: {
    character: {
      required: true,
      type: Object,
    },
  },
};
</script>
