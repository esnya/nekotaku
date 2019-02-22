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

export default {
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
  props: {
    room: {
      required: true,
      type: Object,
    },
  },
};
</script>
