<template lang="pug">
  .character.elevation-2(
    :style="style"
    v-if="!character.hideIcon"
  )
    v-tooltip(bottom)
      .character-inner(
        slot="activator"
        :style="innerStyle"
        @mousedown="$emit('touch', $event)"
        @touchstart="$emit('touch', $event)"
      )
        div.name.text-xs-center.caption {{character.name}}
      div(v-for="line in description") {{line}}
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
    description() {
      const {
        name,
        initiative,
        attributes,
      } = this.character;

      const attributeList = (this.room && attributes)
        ? this.room.characterAttributes.map((key, i) => `${key}：${attributes[i]}`)
        : [];

      return [
        name,
        `イニシアチブ：${initiative}`,
        ...attributeList,
      ];
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
  transition none !important

  .character-inner
    width 50px
    height 50px
    background-color rgba(255, 255, 255, 0.5)
    background-size cover
    display flex
    flex-direction column
    align-items stretch
    justify-content flex-end
    border 1px solid rgba(0, 0, 0, 1)
    transform-origin bottom
    transform translateZ(0.5px)
    transition transform 0.2s ease-in-out
      , background-color 0.2s ease-in-out
      , border 0.2s ease-in-out

  .name
    background-color rgba(255, 255, 255, 0.5)
    text-overflow ellipsis
    white-space nowrap
    overflow hidden
    transition transform 0.2s ease-in-out

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
      transform-origin bottom center
      transform rotateX(-90deg)
      background-color transparent
      border-color rgba(0, 0, 0, 0)

      .name
        transform-origin bottom center
        border 1px solid black
        transform translateY(-50px)
</style>
