<template lang="pug">
  v-layout
    v-spacer
    image-editor(
      :url="character.icon"
      v-if="room"
      @upload="upload"
      @clear="clear"
    )
    v-spacer
</template>

<script>
import { bindAsObject } from '@/browser/models';
import ImageEditor from '@/browser/moleculers/ImageEditor.vue';

export default {
  mixins: [
    bindAsObject('room'),
  ],
  components: {
    ImageEditor,
  },
  methods: {
    upload(file) {
      const {
        roomId,
        character,
      } = this;
      this.$models.characters.updateIcon(roomId, character.id, file);
    },
    clear() {
      const {
        roomId,
        character,
      } = this;
      this.$models.characters.removeIcon(roomId, character.id);
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
