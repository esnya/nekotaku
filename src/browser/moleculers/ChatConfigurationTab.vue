<template lang="pug">
  v-tab(:style="style") {{configuration.name}}
</template>

<script>
export default {
  computed: {
    style() {
      return {
        color: this.configuration.color,
      };
    },
  },
  props: {
    configuration: {
      required: true,
      type: Object,
    },
  },
};
</script>
