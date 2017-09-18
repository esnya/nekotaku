<template lang="pug">
  div.map-container(
    ref="container"
    @mousedown="start"
    @touchstart="start"
    @mousemove="move"
    @touchmove="move"
  )
    div.map(:style="styles.map")
      div.background(:style="styles.background")
        div.row(
          v-for="y in map.height"
          :v-key="y"
        )
          div.tile.text-xs-center(v-for="x in map.width", :v-key="x") {{x}}-{{y}}
      svg(:width="map.width * 50", :height="map.width * 50")
        g(
          v-for="shape in shapes"
          :key="shape.id"
          @mousedown="e => entitySelect(e, shape, 'shape')"
          @touchstart="e => entitySelect(e, shape, 'shape')"
        )
          shape-entity(:shape="shape")
          shape-entity(v-if="showHolder", :shape="shape", holder)
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
import ShapeEntity from './ShapeEntity.vue';

export default {
  components: {
    ShapeEntity,
  },
  computed: {
    ...mapState([
      'map',
      'mapControl',
    ]),
    ...mapState({
      charactersState: 'characters',
      shapeState: 'shapes',
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
        } = character;

        const iconUrl = character ? icon : null;

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
      return this.shapeState.slice().sort((a, b) => a.z > b.z);
    },
    showHolder() {
      const {
        mode,
      } = this.mapControl;

      return mode === 'move' || mode === 'erase';
    },
  },
  data() {
    return {
      scrollOffset: new Vec2(0, 0),
    };
  },
  methods: {
    ...mapActions([
      'alignCharacter',
      'alignShape',
      'createShape',
      'moveCharacter',
      'moveShape',
      'removeShape',
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
      } = this.$refs.container.parentElement;

      const s = this.scale * 50;
      return new Vec2(
        ((pageX + scrollLeft) / s) - 2,
        ((pageY + (scrollTop - 56)) / s) - 2, // 56 = titlebar height
      );
    },
    entitySelect(e, entity, type) {
      const {
        mode,
      } = this.mapControl;

      if (mode === 'move') {
        e.preventDefault();

        const {
          id, x, y,
        } = entity;

        this.selectEntity({
          id,
          type,
          offset: this.page2map(e).sub(new Vec2(x, y)),
        });
      } else if (mode === 'erase' && type === 'shape') {
        e.preventDefault();

        this.removeShape(entity.id);
      }
    },
    start(e) {
      const {
        mode,
        style,
        shapeType,
      } = this.mapControl;

      if (mode === 'move' && e.type === 'mousedown') {
        this.scrollOffset = new Vec2(e.pageX, e.pageY);
      } else if (mode === 'create') {
        const pos = this.page2map(e);

        const {
          width,
          height,
        } = this.map;
        if (pos[0] < 0 || pos[1] < 0 || pos[0] >= width || pos[1] >= height) {
          return;
        }

        e.preventDefault();

        const offset = pos.map(a => align(a, 0.5));
        const alignedPos = offset.toObject();

        if (shapeType === 'circle') {
          this.createShape({
            ...style,
            ...alignedPos,
            type: shapeType,
            radius: 0.5,
            offset,
          });
        } else if (shapeType === 'line' || shapeType === 'ruler') {
          this.createShape({
            ...style,
            ...alignedPos,
            type: shapeType,
            rx: 0,
            ry: 0,
            offset,
          });
        } else if (shapeType === 'rect') {
          this.createShape({
            ...style,
            ...offset.add(0.5).toObject(),
            type: shapeType,
            width: 1,
            height: 1,
            offset,
          });
        }
      }
    },
    move(e) {
      const {
        mode,
        shapeType,
        selected,
      } = this.mapControl;
      if (!selected) {
        if (e.type === 'mousemove' && e.buttons === 1) {
          const pos = new Vec2(e.pageX, e.pageY);
          const d = this.scrollOffset.sub(pos);
          this.scrollOffset = pos;

          const scrollable = this.$refs.container.parentElement;
          scrollable.scrollLeft += d.v[0];
          scrollable.scrollTop += d.v[1];
        }
      } else if (mode === 'move') {
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
      } else if (mode === 'create') {
        const { id, offset } = selected;
        const shape = this.shapes.find(s => s.id === id);
        if (!shape) return;
        if (shapeType === 'circle') {
          const { x, y } = shape;
          const radius = Math.max(align(this.page2map(e).sub(new Vec2(x, y)).len()), 0.5);

          this.updateShape({ id, radius });
        } else if (shapeType === 'line' || shapeType === 'ruler') {
          const size = this.page2map(e).sub(offset).map(a => align(a, 1));
          const pos = offset.add(size.div(2));
          const [rx, ry] = size.v;

          this.updateShape({
            ...pos.toObject(),
            rx,
            ry,
            id,
          });
        } else if (shapeType === 'rect') {
          const size = this.page2map(e).sub(offset).map(a => Math.max(align(Math.abs(a), 1), 1));
          const pos = offset.add(size.div(2));

          this.updateShape({
            ...size.toSizeObject(),
            ...pos.toObject(),
            id,
          });
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
  position relative

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
    border 1px solid rgba(0, 0, 0, 0.5)
    text-align center

  svg
    position absolute;
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
