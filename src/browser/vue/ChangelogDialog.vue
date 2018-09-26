<template lang="pug">
  v-dialog(
    scrollable
    :value="value"
    @input="v => $emit('input', v)"
  )
    v-card
      v-card-text
        vue-simple-markdown(:source="changelog" v-if="changelog")
        loading(v-else)
      v-card-actions
        v-spacer
        v-btn(color="primary" @click="$emit('input', false)") 閉じる
</template>

<script>
import Changelog from '../../../CHANGELOG.md';
import Loading from './Loading.vue';

export default {
  components: {
    Loading,
  },
  data() {
    return {
      changelog: null,
    };
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  async created() {
    const res = await fetch(Changelog);
    this.changelog = await res.text();
  },
};
</script>

<style lang="stylus">
.markdown-body
  h1, h2, h3, h4, ul
    margin 0
</style>
