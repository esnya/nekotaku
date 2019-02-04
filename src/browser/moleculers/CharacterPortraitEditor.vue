<template lang="pug">
  div
    v-layout(row align-baseline)
      character-face-selector(:faces="faces" v-model="face")
      add-icon-button(@click="addFace")
    character-face-input(
      :disabled="face === 'default'"
      :value="face"
      @input="inputFace"
    )
    character-face-editor(
      :character="character"
      :face="face"
      @clear="clear"
    )
</template>

<script>
import _ from 'lodash';
import AddIconButton from '@/browser/atoms/AddIconButton.vue';
import CharacterFaceInput from '@/browser/atoms/CharacterFaceInput.vue';
import CharacterFaceSelector from '@/browser/atoms/CharacterFaceSelector.vue';
import CharacterFaceEditor from '@/browser/moleculers/CharacterFaceEditor.vue';

export default {
  components: {
    AddIconButton,
    CharacterFaceEditor,
    CharacterFaceInput,
    CharacterFaceSelector,
  },
  computed: {
    faces() {
      return _(this.character.portrait || { default: { tags: [] } })
        .pickBy(value => value)
        .keys()
        .value();
    },
    faceUrl() {
      const {
        character,
        face,
      } = this;

      const {
        url,
      } = character.portrait[face] || {};

      return url;
    },
  },
  data: () => ({
    face: 'default',
  }),
  methods: {
    async addFace() {
      const {
        character,
        roomId,
      } = this;

      const face = '新しい表情';

      const newData = _.merge(
        character,
        {
          portrait: {
            [face]: { tags: [] },
          },
        },
      );

      await this.$models.characters.update(roomId, character.id, newData);

      this.face = face;
    },
    clear() {
      this.face = 'default';
    },
    inputFace(value) {
      if (!value) return;

      const {
        face,
        character,
        roomId,
      } = this;
      const {
        portrait,
      } = character;

      const newData = {
        ...character,
        portrait: {
          ..._.pickBy(portrait, (v, key) => key !== face),
          [value]: portrait[face],
        },
      };

      this.$models.characters.update(roomId, character.id, newData);

      this.face = value;
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
