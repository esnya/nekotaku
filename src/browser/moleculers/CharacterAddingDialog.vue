<template lang="pug">
  add-dialog(
    title="キャラクターを追加"
    :value="value"
    v-if="room"
    @add="add"
    @input="onInput"
  )
    character-name-input(v-model="name")
    character-initiative-input(v-model="initiative")
    character-attribute-input(
      :attributeType="attribute"
      :key="(index)"
      v-for="(attribute, index) in characterAttributeTypes"
      :value="attributes[index]"
      @input="attributes[index] = $event"
    )
</template>

<script>
import AddDialog from '@/browser/moleculers/AddDialog.vue';
import CharacterAttributeInput from '@/browser/atoms/CharacterAttributeInput.vue';
import CharacterInitiativeInput from '@/browser/atoms/CharacterInitiativeInput.vue';
import CharacterNameInput from '@/browser/atoms/CharacterNameInput.vue';
import modelWrapper from '@/browser/mixins/modelWrapper';
import characterDAO from '@/browser/dao/characterDAO';

export default {
  mixins: [
    modelWrapper(Boolean, true),
  ],
  components: {
    AddDialog,
    CharacterNameInput,
    CharacterInitiativeInput,
    CharacterAttributeInput,
  },
  computed: {
    characterAttributeTypes() {
      return this.room.characterAttributes || [];
    },
  },
  data: () => ({
    attributes: [],
    initiative: 0,
    name: null,
  }),
  methods: {
    add() {
      const {
        attributes,
        initiative,
        name,
      } = this;

      characterDAO.add(
        {
          attributes,
          initiative,
          name,
          x: 0.5,
          y: 0.5,
        },
      );

      this.close();
    },
    close() {
      this.onInput(false);
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
