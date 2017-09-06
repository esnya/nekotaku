<template lang="pug">
  .container
    v-progress-circular.primary--text(indeterminate, :size="50")
</template>

<script>
import { mapActions } from 'vuex';

export default {
  methods: mapActions([
    'joinRoom',
  ]),
  created() {
    this.joinRoom({
      id: this.$route.params.id,
      router: this.$router,
    });
  },
};
</script>

<style lang="stylus" scoped>
.container
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
</style>
