<template lang="pug">
  v-layout
    v-spacer
    image-editor(
      :url="url"
      v-if="room"
      @upload="upload"
      @clear="clear"
    )
    v-spacer
</template>

<script>
import ImageEditor from '@/browser/moleculers/ImageEditor.vue';
import { bindAsObject } from '@/browser/models';

export default {
  mixins: [
    bindAsObject('room'),
  ],
  components: {
    ImageEditor,
  },
  computed: {
    url() {
      const {
        character,
        face,
      } = this;

      return character.portrait && character.portrait[face] && character.portrait[face].url;
    },
  },
  methods: {
    upload(file) {
      const {
        roomId,
        character,
        face,
      } = this;
      this.$models.characters.updatePortrait(roomId, character.id, face, file);
    },
    clear() {
      const {
        roomId,
        character,
        face,
      } = this;
      this.$models.characters.removePortrait(roomId, character.id, face);
      this.$emit('clear');
    },
  },
  props: {
    character: {
      required: true,
      type: Object,
    },
    face: {
      required: true,
      type: String,
    },
  },
};
</script>
