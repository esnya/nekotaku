<template lang="pug">
  div {{character.name}}を削除しますか？
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
