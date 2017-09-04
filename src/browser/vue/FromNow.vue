<template lang="pug">
  div(v-tooltip:left="{html:full}") {{past}}
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

