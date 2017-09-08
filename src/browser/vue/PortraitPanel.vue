<template lang="pug">
  div
    transition(name="portrait-slide")
      div.portrait-panel(v-if="open", @click="open = !open")
        div.portrait(
          v-for="style in styles"
          :style="style"
        )
    transition(name="portrait-slide")
      div.btn-panel(v-if="!open", @click="open = !open")
        v-btn.expand-btn.primary(fab, dark)
          v-icon mdi-arrow-expand-left
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState([
      'characters',
      'messages',
    ]),
    portraits() {
      const characterPortraits =
        _(this.characters)
          .map((c) => {
            const url = c.portrait.default
              ? c.portrait.default.url
              : c.portrait.icon;

            return [c.name, url];
          })
          .filter(p => p[1])
          .fromPairs()
          .value();

      return _(this.messages.slice())
        .reverse()
        .map(m => m.name)
        .filter(n => n && (n in characterPortraits))
        .map(n => characterPortraits[n])
        .uniq()
        .take(3)
        .value();
    },
    styles() {
      return this.portraits.map((url, i) => ({
        backgroundImage: `url(${url})`,
        transform: `translate(${i * 40}px, ${i * 10}px)`,
        opacity: i === 0 ? 1.0 : 0.5,
        zIndex: this.portraits.length - i,
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
  z-index: 0;

  .portrait
    position: absolute;
    bottom: 0px;
    right: 0;
    height: 250px;
    width: 50%;
    background-position: bottom right;
    background-size: contain;
    transition: all 0.4s ease-in-out;

.btn-panel
  position: relative;
  height: 0;

  .expand-btn
    position: absolute;
    bottom: 16px;
    right: -20px;

.portrait-slide-enter-active, .portrait-slide-leave-active
  transition: transform 0.4s ease-in-out;
.portrait-slide-enter, .portrait-slide-leave-to
  transform: translate(100%, 0);
</style>
