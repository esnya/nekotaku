<template lang="pug">
  v-tooltip(left)
    v-btn.ma-0(flat small slot="activator") {{past}}
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
  props: [
    'time',
  ],
};
</script>
