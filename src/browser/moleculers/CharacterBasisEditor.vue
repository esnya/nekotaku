<template lang="pug">
  div
    character-name-input(v-model="name")
    character-initiative-input(v-model="initiative")
    character-attribute-input(
      :attributeType="attribute"
      :key="(index)"
      v-for="(attribute, index) in characterAttributeNames"
      :value="attributes[index]"
      @input="updateAttribute(index, $event)"
    )
</template>

<script>
import CharacterAttributeInput from '@/browser/atoms/CharacterAttributeInput.vue';
import CharacterInitiativeInput from '@/browser/atoms/CharacterInitiativeInput.vue';
import CharacterNameInput from '@/browser/atoms/CharacterNameInput.vue';

function field(key) {
  return {
    get() {
      return this.character[key];
    },
    set(value) {
      this.update({ [key]: value });
    },
  };
}

export default {
  components: {
    CharacterNameInput,
    CharacterInitiativeInput,
    CharacterAttributeInput,
  },
  computed: {
    name: field('name'),
    initiative: field('initiative'),
    attributes: field('attributes'),
  },
  methods: {
    update(value) {
      const {
        roomId,
        character,
      } = this;

      characterDAO.update(value, character.id);
    },
    updateAttribute(index, value) {
      this.update({
        attributes: this.attributes.map((v, i) => (i === index ? value : v)),
      });
    },
  },
  props: {
    character: {
      required: true,
      type: Object,
    },
    characterAttributeNames: {
      required: true,
      type: Array,
    },
  },
};
</script>
