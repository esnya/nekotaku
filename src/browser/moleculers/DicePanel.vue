<template lang="pug">
  .neko-dice-panel
    dice-animator(:dice="dice" :key="dice.key" v-for="dice in diceList")
</template>

<script>
import DiceAnimator from './DiceAnimator.vue';
import { bindAsList } from '@/browser/models';

export default {
  mixins: [
    bindAsList('messages'),
  ],
  components: {
    DiceAnimator,
  },
  computed: {
    diceList() {
      const now = Date.now();

      return this.messages
        .filter(message => !message.to && now - message.createdAt < 1000)
        .map((message) => message.body
          .filter(node => node.type === 'dice')
          .map(node => node.diceResults)
          .filter(diceResults => diceResults)
          .flat()
          .map(([result, faces]) => (faces === 100 ? [
            { faces: 10, result: Math.floor(result / 10) },
            { faces: 10, result: result % 10 },
          ] : [{ faces, result }]))
          .flat()
          .map((dice, i) => ({
            ...dice,
            key: `${message.id}-${i}`,
          }))
        )
        .flat()
    },
  },
};
</script>

<style lang="stylus" scoped>
.neko-dice-panel
  position fixed
  top 0
  left -32px
  width 100%
  height 0
</style>
