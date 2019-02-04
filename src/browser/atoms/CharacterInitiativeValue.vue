<template lang="pug">
  div {{character.initiative}}
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
