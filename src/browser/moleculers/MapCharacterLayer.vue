<template lang="pug">
  .neko-map-character-layer
    map-character-item(
      :key="character.id"
      :character="character"
      @touch="$emit('touch-entity', $event, character)"
      v-for="character in sortedCharacters"
    )
</template>

<script>
import MapCharacterItem from '@/browser/atoms/MapCharacterPiece.vue';

export default {
  components: {
    MapCharacterItem,
  },
  computed: {
    sortedCharacters() {
      return this.characters.slice().sort((a, b) => a.z > b.z);
    },
  },
  props: {
    characters: {
      required: true,
      type: Array,
    },
  },
};
</script>

<style lang="stylus" scoped>
.neko-map-character-layer
  width 0 !important
  overflow visible
</style>
