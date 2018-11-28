<template lang="pug">
  v-dialog(modal :value="loading")
    v-card
      v-card-text
        v-layout(column align-center)
          v-progress-circular.primary--text(indeterminate :size="50")
          .mt-2 なう、ろーでぃんぐ。
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState([
      'loadingCount',
    ]),
    loading() {
      return this.loadingCount > 0;
    },
  },
};
</script>
