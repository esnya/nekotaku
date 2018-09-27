<template lang="pug">
  .portrait-panel
    transition(name="portrait-slide")
      div(v-if="open")
        img.portrait(
          :key="portarit.name"
          :style="portarit.style"
          :src="portarit.src"
          @click.stop="open = false"
          v-for="portarit in portraits"
        )
      v-btn(
        fab
        dark
        absolute
        bottom right
        color="primary"
        @click.stop="open = true"
        v-else
      )
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
          .map(c => [c.name, _.mapValues(c.portrait, p => p && p.url)])
          .fromPairs()
          .value();

      return _(this.messages.slice())
        .reverse()
        .filter(m => m.name && (m.name in characterPortraits) && characterPortraits[m.name][m.face])
        .uniqBy(m => m.name)
        .take(N)
        .map(m => ({ name: m.name, src: characterPortraits[m.name][m.face] }))
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
  bottom: 8px !important;

.portrait-slide
  &-enter-active
  &-leave-active
    transition: transform 0.4s ease-in-out;

  &-enter
  &-leave-to
    transform: translate(100%, 0);
</style>
