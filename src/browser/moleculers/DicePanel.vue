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
import palette from 'google-material-color';
import { bindAsList } from '@/browser/models';

function hash(data) {
  // eslint-disable-next-line no-bitwise
  return data.split('').map(a => a.charCodeAt(0)).reduce((a, b) => (b * 7) ^ a);
}

function selectColorName(n) {
  const colorNames = Object.keys(palette.palette).filter(name => name !== 'White' && name !== 'Black');
  return colorNames[n % colorNames.length];
}

export default {
  mixins: [
    bindAsList('messages'),
  ],
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
        .filter(m => now - m.createdAt < 1000 && !m.to)
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
            frameColor: '#ffffff',
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
  position fixed
  top 0
  left -32px
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
      animation dice-out 0.4s 4s linear forwards
      transform-style preserve-3d
      transform rotateX(-10deg) rotateY(-10deg)

@keyframes dice-out {
  to {
    transform scale3d(0.01, 0.01, 0.01)
  }
}
</style>
