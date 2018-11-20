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
            v-for="shape in sortedShapes"
            :key="shape.id"
            @mousedown="e => mms.onShapeTouch(e, shape)"
            @touchstart="e => mms.onShapeTouch(e, shape)"
          )
            shape-entity(:shape="shape")
            shape-entity(v-if="showHolder", :shape="shape", holder)
        .layer
          map-character-item(
            :key="character.id"
            :character="character"
            v-for="character in sortedCharacters"
            @touch="e => mms.onCharacterTouch(e, character)"
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
import { mapMutations, mapState } from 'vuex';
import Loading from '@/browser/components/Loading.vue';
import MapCharacterItem from '@/browser/components/MapCharacterItem.vue';
import ShapeEntity from '@/browser/components/ShapeEntity.vue';
import getMapModeStrategy from '@/browser/map';
import { align, limit } from '@/browser/utilities/entity';

export default {
  components: {
    Loading,
    MapCharacterItem,
    ShapeEntity,
  },
  computed: {
    ...mapState([
      'mapControl',
    ]),
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
    sortedCharacters() {
      return this.characters.slice().sort((a, b) => a.z > b.z);
    },
    sortedShapes() {
      return this.shapes.slice().sort((a, b) => a.z > b.z);
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
    async alignCharacter(characterId) {
      const character = this.characters.find(i => i.id === characterId);
      if (!character) return;

      const { x, y } = character;

      await this.$models.characters.update(
        this.roomId,
        characterId,
        {
          x: align(x),
          y: align(y),
          z: Date.now(),
        },
      );
    },
    async moveCharacter({ id, x, y }) {
      const { width, height } = this.map;
      await this.$models.characters.update(
        this.roomId,
        id,
        {
          x: limit(x, width),
          y: limit(y, height),
          z: Date.now(),
        },
      );
    },
    async alignShape(id) {
      const shape = this.shapes.find(s => s.id === id);
      if (!shape) return;

      const { x, y } = shape;
      await this.$models.shapes.update(
        this.roomId,
        id,
        {
          x: align(x),
          y: align(y),
          z: Date.now(),
        },
      );
    },
    async moveShape({ id, x, y }) {
      const { width, height } = this.map;
      await this.$models.shapes.update(
        this.roomId,
        id,
        {
          x: limit(x, width),
          y: limit(y, height),
          z: Date.now(),
        },
      );
    },
    async createShape({
      offset, stroke, fill, ...shape
    }) {
      const id = await this.$models.shapes.push(
        this.roomId,
        {
          ...shape,
          stroke,
          fill,
        },
      );

      this.selectEntity({
        id,
        type: 'entity',
        offset,
      });
    },
    async updateShape({ id, ...data }) {
      await this.$models.shapes.update(
        this.roomId,
        id,
        data,
      );
    },
    async removeShape(id) {
      await this.$models.shapes.remove(
        this.roomId,
        id,
      );
    },
  },
  props: {
    characters: {
      required: true,
      type: Array,
    },
    map: {
      required: true,
      type: Object,
    },
    roomId: {
      required: true,
      type: String,
    },
    shapes: {
      required: true,
      type: Array,
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

.editor
  position absolute
  top 100px
  left 100px
  right 100px
  bottom 100px
</style>
