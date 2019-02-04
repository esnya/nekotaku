<template lang="pug">
  v-btn(:color="color" @click="$emit('click', $event)") 保存
</template>

<script>
export default {
  props: {
    color: {
      type: String,
    },
  },
};
</script>
