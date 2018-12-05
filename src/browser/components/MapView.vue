<template lang="pug">
  .map-container(
    v-if="map"
    ref="container"
    @mousedown="e => mms.onMapTouch(e)"
    @touchstart="e => mms.onMapTouch(e)"
    @touchmove="e => mms.mapMove(e)"
  )
    div.map(
      :class="{ perspective: mapControl.perspective }"
      :style="styles.map"
      @mousemove="e => mms.mapDrag(e)"
    )
      div.map-inner(:style="styles.mapInner")
        div.row(
          :v-key="y"
          v-for="y in map.height"
          v-if="!map.hideGrid"
        )
          div.tile.text-xs-center(v-for="x in map.width", :v-key="x") {{x}}-{{y}}
        svg.layer(:width="map.width * 50", :height="map.width * 50")
          g(
            v-for="shape in shapes"
            :key="shape.id"
            @mousedown="e => mms.onShapeTouch(e, shape)"
            @touchstart="e => mms.onShapeTouch(e, shape)"
          )
            shape-entity(:shape="shape")
            shape-entity(v-if="showHolder", :shape="shape", holder)
        .layer
          .character.elevation-2(
            :key="character.id"
            :style="character.style"
            v-for="character in characters"
            v-if="!character.hideIcon"
          )
            v-tooltip(bottom)
              .character-inner(
                slot="activator"
                :style="character.innerStyle"
                @mousedown="e => mms.onCharacterTouch(e, character)"
                @touchstart="e => mms.onCharacterTouch(e, character)"
              )
                .name.text-xs-center.caption {{character.name}}
              div(v-for="line in getCharacterDescription(character)") {{line}}
  loading(v-else)
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import getMapModeStrategy from '../map';
import Loading from '@/browser/components/Loading.vue';
import ShapeEntity from '@/browser/components/ShapeEntity.vue';

export default {
  components: {
    Loading,
    ShapeEntity,
  },
  computed: {
    ...mapState([
      'room',
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
        mapInner: {
          width: `${this.map.width * 50}px`,
          height: `${this.map.height * 50}px`,
          backgroundImage: `url(${this.map.backgroundImage})`,
        },
      };
    },
    characters() {
      return this.charactersState.map((character) => {
        const {
          x, y,
          icon,
          iconSize,
        } = character;

        const iconUrl = character ? icon : null;
        const size = `${(iconSize || 1) * 50}px`;

        return {
          ...character,
          style: {
            transform: `translate(${(x * 50) - 25}px, ${(y * 50) - 25}px)`,
          },
          innerStyle: {
            backgroundImage: iconUrl ? `url(${iconUrl})` : null,
            width: size,
            height: size,
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
    mms() {
      const { mode } = this.mapControl;
      return getMapModeStrategy(mode || 'move', this);
    },
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
    getCharacterDescription(character) {
      const {
        name,
        initiative,
        attributes,
      } = character;

      return [
        name,
        `イニシアチブ：${initiative}`,
        ...this.room.characterAttributes.map((key, i) => `${key}：${attributes[i]}`),
      ];
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

    subscribe('mousemove', e => this.mms.mapMove(e));
    subscribe('mouseup', e => this.mms.onMoveEnd(e));
    subscribe('touchend', e => this.mms.onMoveEnd(e));

    document.body.parentElement.classList.add('no-scroll');
  },
  destroyed() {
    document.body.parentElement.classList.remove('no-scroll');
    this.unsibscribe();
  },
};
</script>

<style lang="stylus">
html.no-scroll {
  overflow hidden
}
</style>

<style lang="stylus" scoped>
.map-container
  overflow scroll
  margin-bottom 104px
  width 100%
  height calc(100% - 104px)

.map
  user-select none
  padding 100px
  display inline-block

  transition transform 0.4s ease-in-out
  transform-origin top left

  transform-style preserve-3d
  perspective 1000px
  perspective-origin center center

  *
    transform-style preserve-3d

.map-inner
  transition transform 0.4s ease-in-out
  transform-origin bottom
  position relative
  background-origin content-box
  background-size 100% 100%

.row
  white-space nowrap
  height 50px

.tile
  display inline-block
  width 50px
  height 50px
  border 1px solid rgba(0, 0, 0, 0.5)
  text-align center

.layer
  position absolute
  top 0
  left 0

svg g *
  box-shadow 0 0 5px rgba(0, 0, 0, 0.5)

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

.editor
  position absolute
  top 100px
  left 100px
  right 100px
  bottom 100px

.perspective
  .map-inner
    transform rotateX(90deg)

  .character
    box-shadow none !important

    &:after
      content: ' '
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
    border: none

  .name
    border 1px solid black
    transform translateY(-50px)
</style>
