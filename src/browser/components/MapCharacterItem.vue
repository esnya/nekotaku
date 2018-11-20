<template lang="pug">
  .character.elevation-2(
    :style="style"
    v-if="!character.hideIcon"
  )
    .character-inner(
      :style="innerStyle"
      @mousedown="$emit('touch', $event)"
      @touchstart="$emit('touch', $event)"
    )
      div.name.text-xs-center.caption {{character.name}}
</template>

<script>
export default {
  computed: {
    style() {
      const {
        x, y,
      } = this.character;

      return {
        transform: `translate(${(x * 50) - 25}px, ${(y * 50) - 25}px)`,
      };
    },
    innerStyle() {
      const {
        icon,
        iconSize,
      } = this.character;

      const size = `${(iconSize || 1) * 50}px`;

      return {
        backgroundImage: icon ? `url(${icon})` : null,
        width: size,
        height: size,
      };
    },
  },
  props: {
    character: {
      required: true,
      type: Object,
    },
  },
};
</script>


<style lang="stylus" scoped>
.character
  position absolute

  .character-inner
    width 50px
    height 50px
    background-color rgba(255, 255, 255, 0.5)
    background-size cover
    display flex
    flex-direction column
    align-items stretch
    justify-content flex-end
    border 1px solid black
    transform-origin bottom
    transition transform 0.4s ease-in-out
    transform translateZ(0.5px)

  .name
    background-color rgba(255, 255, 255, 0.5)
    text-overflow ellipsis
    white-space nowrap
    overflow hidden
    transition transform 0.4s ease-in-out

.perspective
  .character
    box-shadow none !important

    &:after
      content ' '
      width 40px
      height 10px
      position absolute
      top 46px
      left 5px
      border-radius 50%
      background rgba(0, 0, 0, 0.6)
      box-shadow 0 0 10px rgba(0, 0, 0, 0.6)

    .character-inner
      transform rotateX(-90deg)
      background-color transparent
      border none

      .name
        border 1px solid black
        transform translateY(-50px)
</style>
