<template lang="pug">
  .portrait-panel
    transition(name="portrait-slide")
      div(v-if="open")
        img.portrait(
          v-for="portarit in portraits"
          :key="portarit.name"
          :style="portarit.style"
          :src="portarit.src"
          @click="open = !open"
        )
      v-btn(color="primary" v-else fab dark @click="open = !open")
        v-icon mdi-arrow-expand-left
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';

const N = 3;
const Wait = 40;

export default {
  computed: {
    ...mapState([
      'characters',
      'messages',
    ]),
    portraits: _.throttle(function portraits() {
      const characterPortraits =
        _(this.characters)
          .map((c) => {
            const url = c.portrait && c.portrait.default && c.portrait.default.url;

            return [c.name, url];
          })
          .filter(p => p[1])
          .fromPairs()
          .value();

      return _(this.messages.slice())
        .reverse()
        .map(m => m.name)
        .filter(n => n && (n in characterPortraits))
        .uniq()
        .take(N)
        .map(name => ({ name, src: characterPortraits[name] }))
        .map(({ name, src }, i) => ({
          name,
          style: {
            transform: `translate3d(${i * 10}vw, ${i * 3}vh, ${-i}px)`,
            opacity: i ? 0.5 : 1,
          },
          src,
        }))
        .sort((a, b) => ((a.name > b.name) ? -1 : 1))
        .value();
    }, Wait),
  },
  data() {
    return {
      N,
      open: true,
    };
  },
};
</script>

<style lang="stylus" scoped>
.portrait-panel
  position fixed
  bottom 114px
  width 100%
  height 0
  transform-style preserve-3d

.portrait
  position absolute
  bottom 0
  right 0
  max-width 50vw
  max-height 50vh
  transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;

button
  position: absolute;
  right: -16px;
  bottom: 8px;

.portrait-slide
  &-enter-active
  &-leave-active
    transition: transform 0.4s ease-in-out;

  &-enter
  &-leave-to
    transform: translate(100%, 0);
</style>
