<template lang="pug">
  .neko-dice-panel
    .dice-container-outer(
      v-for="dice in diceList"
      v-if="dice.shown"
      :key="dice.key"
      :style="{ animationDelay: `${dice.i * 0.1}s` }"
    )
      .dice-container-inner(
        @animationend="dice.shown = false"
      )
        dice(
          :angle="dice.result"
          :faces="dice.faces"
          :color="color"
          :firstColor="dice.firstColor"
          :backgroundColor="dice.backgroundColor"
          :frameColor="dice.frameColor"
        )
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';
import palette from 'google-material-color';

function hash(data) {
  // eslint-disable-next-line no-bitwise
  return data.split('').map(a => a.charCodeAt(0)).reduce((a, b) => (b * 7) ^ a);
}

function selectColorName(n) {
  const colorNames = Object.keys(palette.palette).filter(name => name !== 'White' && name !== 'Black');
  return colorNames[n % colorNames.length];
}

export default {
  computed: mapState([
    'messages',
  ]),
  data() {
    return {
      color: palette.get('White', 'Secondary'),
      diceList: [],
    };
  },
  watch: {
    messages(messages) {
      const now = Date.now();

      this.diceList = _(messages)
        .filter(m => now - m.createdAt < 1000)
        .map(m => ({
          id: m.id,
          diceResults: _(m.body)
            .filter(n => n.type === 'dice')
            .map(n => n.diceResults)
            .flatten()
            .map(([result, faces]) => ({ faces, result }))
            .map(r => (r.faces === 100 ? [
              { faces: 10, result: Math.floor(r.result / 10) },
              { faces: 10, result: r.result % 10 },
            ] : [r]))
            .flatten()
            .value(),
        }))
        .filter(m => m.diceResults)
        .map(({ id, diceResults }) => {
          const colorKey = hash(`${id}color`);
          const colorName = selectColorName(colorKey);

          const backgroundColor = palette.get(colorName);
          const firstColor = palette.get(['Red', 'Pink', 'Deep Orange'].indexOf(colorName) >= 0 ? 'White' : 'Red');

          return diceResults.map((r, i) => ({
            key: `${id}-${i}`,
            ...r,
            i,
            backgroundColor,
            firstColor,
            shown: true,
          }));
        })
        .flatten()
        .value();
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '../styles/dice.styl'

.neko-dice-panel
  position absolute
  top 0
  width 100%
  height 0

  .dice-container-outer
    display inline-block
    position relative

    margin 10px

    animation-name dice-roll
    animation-duration 3s
    animation-timing-function linear
    animation-fill-mode both

    transform-style preserve-3d

    .dice-container-inner
      animation fade-out 1s 4s linear forwards

@keyframes fade-out {
  to {
    opacity 0
  }
}
</style>
