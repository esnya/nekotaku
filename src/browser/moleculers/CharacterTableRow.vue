<template lang="pug">
  tr
    td.pa-0.neko-td-edit
      edit-icon-button(@click="editingDialog = true")
    td
      character-name-value(:character="character")
    td.text-xs-center
      character-initiative-value(:character="character")
    td.text-xs-center(
      :key="index"
      v-for="(attributeName, index) in characterAttributeNames"
    )
      character-attribute-value(:index="index" :character="character")
    character-editing-dialog(
      :character="character"
      :character-attribute-names="characterAttributeNames"
      v-model="editingDialog"
    )
</template>

<script>
import CharacterAttributeValue from '@/browser/atoms/CharacterAttributeValue.vue';
import CharacterEditingDialog from '@/browser/moleculers/CharacterEditingDialog.vue';
import CharacterInitiativeValue from '@/browser/atoms/CharacterInitiativeValue.vue';
import CharacterNameValue from '@/browser/atoms/CharacterNameValue.vue';
import EditIconButton from '@/browser/atoms/EditIconButton.vue';

export default {
  components: {
    CharacterAttributeValue,
    CharacterInitiativeValue,
    CharacterNameValue,
    CharacterEditingDialog,
    EditIconButton,
  },
  data: () => ({
    editingDialog: false,
  }),
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

<style lang="stylus" scoped>
.neko-td-edit
  width 32px

  button
    margin-right 0
</style>
