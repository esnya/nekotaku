<template lang="pug">
  div.portrait-panel
    div.portrait(
      v-for="style in styles.reverse()"
      :style="style"
      :data-visible="open"
      @click="open = !open"
    )
    div.portrait-open(:data-visible="!open", @click="open = !open")
      v-btn.primary(fab, dark)
        v-icon mdi-arrow-expand-left
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState([
      'portraits',
    ]),
    styles() {
      return this.portraits.map((url, i) => ({
        backgroundImage: `url(${url})`,
        transform: `translate(${i * 40}px, ${i * 10}px)`,
        opacity: i === 0 ? 1.0 : 0.5,
      }));
    },
  },
  data() {
    return {
      open: true,
    };
  },
};
</script>

<style lang="stylus" scoped>
  .portrait-panel
    position: relative;

    > *
      transition: transform 0.4s ease-in-out;
      transform: translate(100%, 0);

    > [data-visible=true]
      transform: translate(0, 0);

    .portrait
      position: absolute;
      bottom: 0px;
      right: 0;
      height: 250px;
      width: 50%;
      background-position: bottom right;
      background-size: contain;
      transition: all 0.4s ease-in-out;

    .portrait-open
      position: absolute;
      bottom: 16px;
      right: -20px;
    

</style>
