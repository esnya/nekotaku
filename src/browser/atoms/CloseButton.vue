<template lang="pug">
  v-btn(:color="color" @click="$emit('click', $event)") 閉じる
</template>

<script>
export default {
  props: {
    color: {
      required: false,
      type: String,
    },
  },
};
</script>
