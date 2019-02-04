<template lang="pug">
  v-list-tile(@click="$emit('click', $event)")
    v-list-tile-content
      v-list-tile-title {{item}}
</template>

<script>
export default {
  props: {
    item: {
      required: true,
      type: String,
    },
  },
};
</script>
