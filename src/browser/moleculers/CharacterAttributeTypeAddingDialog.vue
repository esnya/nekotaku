<template lang="pug">
  add-dialog(
    title="キャラクター属性を追加"
    :value="value"
    @add="add"
    @input="onInput"
  )
    character-attribute-type-input(v-model="characterAttributeType")
</template>

<script>
import CharacterAttributeTypeInput from '@/browser/atoms/CharacterAttributeTypeInput.vue';
import AddDialog from '@/browser/moleculers/AddDialog.vue';
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [modelWrapper(Boolean, true)],
  components: {
    AddDialog,
    CharacterAttributeTypeInput,
  },
  data: () => ({
    characterAttributeType: null,
  }),
  methods: {
    async add() {
      if (!await this.$validator.validateAll()) return;
      this.$emit('add', this.characterAttributeType);
    },
  },
};
</script>
