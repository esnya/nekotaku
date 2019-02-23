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
import fromPairs from 'lodash/fromPairs';
import mapValues from 'lodash/mapValues';
import take from 'lodash/take';
import uniqBy from 'lodash/uniqBy';

const N = 3;

export default {
  computed: {
    portraits() {
      const characterPortraitPairs = this.characters
        .map(c => [c.name, mapValues(c.portrait, p => p && p.url)]);
      const characterPortraits = fromPairs(characterPortraitPairs);

      const tmp1 = this.messages.slice()
        .reverse()
        .filter(
          m => m.name && (m.name in characterPortraits) && characterPortraits[m.name][m.face],
        );
      return take(uniqBy(tmp1, m => m.name), N)
        .map(m => ({ name: m.name, src: characterPortraits[m.name][m.face] }))
        .map(({ name, src }, i) => ({
          name,
          style: {
            transform: `translate3d(${i * 10}vw, ${i * 3}vh, ${-i}px)`,
            opacity: i ? 0.5 : 1,
          },
          src,
        }))
        .sort((a, b) => ((a.name > b.name) ? -1 : 1));
    },
  },
  data() {
    return {
      open: true,
    };
  },
  props: {
    characters: {
      required: true,
      type: Array,
    },
    messages: {
      required: true,
      type: Array,
    },
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
