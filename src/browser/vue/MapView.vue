<template lang="pug">
  div.map-container
    div.map(:style="styles.map")
      div.layer(:style="styles.background")
        div.row(v-for="y in map.height", :v-key="y")
          div.tile.text-xs-center(v-for="x in map.width", :v-key="x") {{x}}-{{y}}
      div.layer
        svg.shape(
          v-for="shape in shapes"
          :width="shape.width"
          :height="shape.height"
          :style="shape.style"
          @mousedown.prevent="e => entitySelect(e, shape, 'shape')"
          @touchstart.prevent="e => entitySelect(e, shape, 'shape')"
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
          @mousedown.prevent="e => entitySelect(e, character, 'character')"
          @touchstart.prevent="e => entitySelect(e, character, 'character')"
        )
          div.name.text-xs-center.caption {{character.name}}
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import Vec2 from '../utilities/Vec2';

export default {
  computed: {
    ...mapState([
      'map',
      'mapControl',
    ]),
    ...mapState({
      shapesState: 'shapes',
      charactersState: 'characters',
    }),
    styles() {
      return {
        map: {
          transform: `scale(${2 ** this.mapControl.zoom})`,
        },
        background: {
          backgroundImage: `url(${this.map.backgroundImage})`,
        },
      };
    },
    characters() {
      return this.charactersState.map((character) => {
        const {
          x, y,
          icon,
          portrait,
        } = character;

        const iconUrl = character ? (icon || portrait.default) : null;

        return {
          ...character,
          style: {
            transform: `translate(${x * 50}px, ${y * 50}px)`,
            backgroundImage: iconUrl ? `url(${iconUrl})` : null,
          },
        };
      }).sort((a, b) => a.z > b.z);
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
      }).sort((a, b) => a.z > b.z);
    },
  },
  data() {
    return {
      zoom: 0,
    };
  },
  methods: {
    ...mapActions([
      'alignCharacter',
      'alignShape',
      'moveCharacter',
      'moveShape',
    ]),
    ...mapMutations([
      'selectEntity',
      'deselectEntity',
    ]),
    getEntityPos(e) {
      const {
        offset,
        startPos,
      } = this.mapControl.selected;

      return Vec2.getScreen(e)
        .sub(offset)
        .div(50)
        .add(startPos);
    },
    entitySelect(e, entity, type) {
      if (this.mapControl.mode !== 'move') return;

      const {
        id,
        x, y,
      } = entity;

      this.selectEntity({
        id,
        type,
        offset: Vec2.getScreen(e),
        startPos: new Vec2(x, y),
      });
    },
    shapeMove(e) {
      const {
        mode,
        selected,
      } = this.mapControl;
      if (!selected) return;

      if (mode === 'move') {
        const {
          id,
          type,
        } = selected;

        const pos = this.getEntityPos(e).toObject();
        if (type === 'shape') {
          this.moveShape({
            ...pos,
            id,
          });
        } else if (type === 'character') {
          this.moveCharacter({
            ...pos,
            id,
          });
        }
      }
    },
    shapeDeselect() {
      const {
        mode,
        selected,
      } = this.mapControl;
      if (!selected) return;

      if (mode === 'move') {
        const {
          id,
          type,
        } = selected;

        if (type === 'shape') {
          this.alignShape(id);
        } else if (type === 'character') {
          this.alignCharacter(id);
        }

        this.deselectEntity();
      }
    },
  },
  created() {
    const unsubscribers = [];

    function subscribe(event, handler) {
      const bindedHandler = e => handler(e);
      window.addEventListener(event, bindedHandler);
      unsubscribers.push(() => window.removeEventListener(event, bindedHandler));
    }

    this.unsibscribe = () => unsubscribers.forEach(f => f());

    subscribe('mousemove', this.shapeMove);
    subscribe('touchmove', this.shapeMove);
    subscribe('mouseup', this.shapeDeselect);
    subscribe('touchend', this.shapeDeselect);
  },
  destroyed() {
    this.unsibscribe();
  },
};
</script>

<style lang="stylus" scoped>
.map-container
  overflow scroll
  position relative
  height 100%

.map
  position absolute
  transition transform 0.4s ease-in-out

  .layer
    background-origin content-box
    background-size 100% 100%
    padding 100px
    position absolute
    top 0
    left 0
    z-index 0

  .row
    white-space nowrap
    height 50px

  .tile
    display inline-block
    width 50px
    height 50px
    border 1px solid black
    text-align center

  .shape
    position absolute
    top 100px
    left 100px

  .character
    position absolute
    top 100px
    left 100px
    width 50px
    height 50px
    background-color rgba(255, 255, 255, 0.5)
    background-size cover
    display flex
    flex-direction column
    align-items stretch
    justify-content flex-end
    border 1px solid black

    .name
      background-color rgba(255, 255, 255, 0.5)
      text-overflow ellipsis
      white-space nowrap
      overflow hidden
</style>
