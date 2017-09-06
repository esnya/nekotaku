<template lang="pug">
  div.map-container(
    ref="container"
    @mousedown="entityCreate"
    @touchstart="entityCreate"
  )
    div.map(:style="styles.map")
      div.background(:style="styles.background")
        div.row(
          v-for="y in map.height"
          :v-key="y"
        )
          div.tile.text-xs-center(v-for="x in map.width", :v-key="x") {{x}}-{{y}}
      div.layer
        svg.shape(
          v-for="shape in shapes"
          :width="shape.bw"
          :height="shape.bh"
          :style="shape.style"
          @mousedown="e => entitySelect(e, shape, 'shape')"
          @touchstart="e => entitySelect(e, shape, 'shape')"
        )
          circle(
            v-if="shape.type === 'circle'"
            :cx="shape.radius * 50"
            :cy="shape.radius * 50"
            :r="shape.radius * 50"
          )
          rect(
            v-if="shape.type === 'rect'"
            :width="shape.width * 50"
            :height="shape.height * 50"
          )
      div.layer
        div.character.elevation-2(
          v-for="character in characters"
          v-tooltip:bottom="{html:character.name}"
          :style="character.style"
          @mousedown="e => entitySelect(e, character, 'character')"
          @touchstart="e => entitySelect(e, character, 'character')"
        )
          div.name.text-xs-center.caption {{character.name}}
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import Vec2 from '../utilities/Vec2';
import { align } from '../utilities/entity';

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
    scale() {
      return 2 ** this.mapControl.zoom;
    },
    styles() {
      return {
        map: {
          transform: `scale(${this.scale})`,
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
            transform: `translate(${(x * 50) - 25}px, ${(y * 50) - 25}px)`,
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
          circle: ({ radius }) => [radius * 2, radius * 2],
          rect: ({ width, height }) => [width, height],
        };
        const bbHandler = bbHandlers[type];
        const [bw, bh] = bbHandler(shape).map(a => a * 50);

        return {
          ...shape,
          bw,
          bh,
          style: {
            transform: `translate(${(x * 50) - (bw / 2)}px, ${(y * 50) - (bh / 2)}px)`,
            fill: fill || 'none',
            stroke: stroke || 'none',
            strokeWidth: strokeWidth || null,
          },
        };
      }).sort((a, b) => a.z > b.z);
    },
  },
  methods: {
    ...mapActions([
      'alignCharacter',
      'alignShape',
      'createShape',
      'moveCharacter',
      'moveShape',
      'updateShape',
    ]),
    ...mapMutations([
      'selectEntity',
      'deselectEntity',
    ]),
    page2map(e) {
      const {
        touches,
      } = e;

      if (touches && touches[0]) return this.page2map(touches[0]);

      const {
        pageX,
        pageY,
      } = e;
      const {
        scrollLeft,
        scrollTop,
      } = this.$refs.container;

      const s = this.scale * 50;
      return new Vec2(
        ((pageX + scrollLeft) / s) - 2,
        ((pageY + (scrollTop - 56)) / s) - 2, // 56 = titlebar height
      );
    },
    entitySelect(e, entity, type) {
      if (this.mapControl.mode !== 'move') return;

      e.preventDefault();

      const {
        id, x, y,
      } = entity;

      this.selectEntity({
        id,
        type,
        offset: this.page2map(e).sub(new Vec2(x, y)),
      });
    },
    entityCreate(e) {
      const {
        mode,
        style,
      } = this.mapControl;
      if (mode === 'move') return;

      const pos = this.page2map(e);

      const {
        width,
        height,
      } = this.map;
      if (pos[0] < 0 || pos[1] < 0 || pos[0] >= width || pos[1] >= height) {
        return;
      }

      e.preventDefault();

      const aligngedPos = pos.map(a => align(a, 0.5)).toObject();

      if (mode === 'circle') {
        this.createShape({
          ...style,
          ...aligngedPos,
          type: 'circle',
          radius: 0.5,
        });
      } else if (mode === 'rect') {
        this.createShape({
          ...style,
          ...aligngedPos,
          type: 'rect',
          w: 1,
          h: 1,
        });
      }
    },
    move(e) {
      const {
        mode,
        selected,
      } = this.mapControl;
      if (!selected) return;

      if (mode === 'move') {
        const {
          id,
          type,
          offset,
        } = selected;

        const pos = this.page2map(e).sub(offset).toObject();

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
      } else {
        const { id } = selected;
        const shape = this.shapes.find(s => s.id === id);
        if (!shape) return;
        if (mode === 'circle') {
          const { x, y } = shape;
          const radius = Math.max(align(this.page2map(e).sub(new Vec2(x, y)).len()), 0.5);

          this.updateShape({ id, radius });
        } else if (mode === 'rect') {
          const { x, y } = shape;
          const [width, height] = this.page2map(e)
            .sub(new Vec2(x, y))
            .map(a => Math.max(align(Math.abs(a) + 1, 1), 1)).v;

          this.updateShape({ id, width, height });
        }
      }
    },
    end() {
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
      }

      this.deselectEntity();
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

    subscribe('mousemove', this.move);
    subscribe('touchmove', this.move);
    subscribe('mouseup', this.end);
    subscribe('touchend', this.end);
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
  user-select none
  position absolute
  transition transform 0.4s ease-in-out
  transform-origin top left

  .background
    background-origin content-box
    background-size 100% 100%
    padding 100px
    top 0
    left 0

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

  .editor
    position absolute
    top 100px
    left 100px
    right 100px
    bottom 100px
</style>
