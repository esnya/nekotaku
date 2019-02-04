<template lang="pug">
  vue-simple-markdown(:source="changelog" v-if="changelog")
  loading(v-else)
</template>

<script>
import ChangelogUrl from '../../../CHANGELOG.md';
import Loading from '@/browser/atoms/Loading.vue';

export default {
  components: {
    Loading,
  },
  data() {
    return {
      changelog: null,
    };
  },
  async created() {
    const res = await fetch(ChangelogUrl);
    this.changelog = await res.text();
  },
};
</script>

<style lang="stylus">
.markdown-body
  h1, h2, h3, h4, ul
    margin 0
</style>
