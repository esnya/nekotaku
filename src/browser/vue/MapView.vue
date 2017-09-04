<template lang="pug">
  div.map-container
    div.map
      div.layer(:style="styles.background")
        div.row(v-for="y in map.height", :v-key="y")
          div.tile.text-xs-center(v-for="x in map.width", :v-key="x") {{x}}-{{y}}
      div.layer
        svg.shape.elevation-1(
          v-for="shape in shapes"
          :width="shape.width"
          :height="shape.height"
          :style="shape.style"
        )
            circle(
              v-if="shape.type === 'circle'"
              :cx="shape.radius * 50"
              :cy="shape.radius * 50"
              :r="shape.radius * 50"
            )
      div.layer
        div.character.elevation-2(
          v-for="character in characters"
          v-tooltip:bottom="{html:character.name}"
          :style="character.style"
        )
          div.name.text-xs-center.caption {{character.name}}
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState([
      'map',
    ]),
    ...mapState({
      shapesState: 'shapes',
      charactersState: 'characters',
    }),
    styles() {
      return {
        background: {
          backgroundImage: `url(${this.map.backgroundImage})`,
        },
      };
    },
    characters() {
      return this.charactersState.map((character) => {
        const {
          x, y,
          name,
          icon,
          portrait,
        } = character;

        const iconUrl = character ? (icon || portrait.default) : null;

        return {
          name,
          style: {
            transform: `translate(${x * 50}px, ${y * 50}px)`,
            backgroundImage: iconUrl ? `url(${iconUrl})` : null,
          },
        };
      });
    },
    shapes() {
      return this.shapesState.map((shape) => {
        const {
          x, y,
          type,
          fill,
          stroke,
          strokeWidth,
        } = shape;

        const bbHandlers = {
          circle: ({ radius }) => [radius * 100, radius * 100],
        };
        const bbHandler = bbHandlers[type];
        const [width, height] = bbHandler(shape);

        return {
          ...shape,
          width,
          height,
          style: {
            transform: `translate(${x * 50}px, ${y * 50}px)`,
            fill: fill || 'none',
            stroke: stroke || 'none',
            strokeWidth: strokeWidth || null,
          },
        };
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.map-container
  overflow: scroll;
  position: relative;
  height: 100%;

.map
  position: absolute;

  .layer
    background-origin: content-box;
    background-size: 100% 100%;
    padding: 100px;
    position: absolute;
    top: 0;
    left: 0;

  .row
    white-space: nowrap;
    height: 50px;

  .tile
    display: inline-block;
    width: 50px;
    height: 50px;
    border: 1px solid black;
    text-align: center;

  .shape
    position: absolute;
    top: 100px;
    left: 100px;

  .character
    position: absolute;
    top: 100px;
    left: 100px;
    width: 50px;
    height: 50px;
    background-color: rgba(255, 255, 255, 0.5);
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content flex-end;
    border: 1px solid black;

    .name
      background-color: rgba(255, 255, 255, 0.5);
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
</style>
