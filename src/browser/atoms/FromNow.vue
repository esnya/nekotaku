<template lang="pug">
  v-tooltip(left)
    span(slot="activator") {{past}}
    span {{full}}
</template>

<script>
import moment from 'moment';

export default {
  computed: {
    full() {
      return moment(this.time).format('lll');
    },
    past() {
      return moment(this.time).fromNow();
    },
  },
  props: {
    time: {
      required: true,
    },
  },
};
</script>
