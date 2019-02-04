<template lang="pug">
  simple-dialog(
    title="キャラクターを編集"
    :value="value"
    v-if="character"
    @input="onInput"
  )
    character-editing-tabs(
      :character="character"
      :character-attribute-names="characterAttributeNames"
    )
</template>

<script>
import CharacterEditingTabs from '@/browser/moleculers/CharacterEditingTabs.vue';
import SimpleDialog from '@/browser/moleculers/SimpleDialog.vue';
import modelWrapper from '@/browser/mixins/modelWrapper';

export default {
  mixins: [
    modelWrapper(Boolean, true),
  ],
  components: {
    CharacterEditingTabs,
    SimpleDialog,
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
