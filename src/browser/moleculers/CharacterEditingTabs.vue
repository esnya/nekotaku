<template lang="pug">
  v-tabs(
    centered
    icons-and-text
    light
    v-model="tab"
  )
    v-tab
      div 基本データ
      v-icon format_list_bulleted
    v-tab
      div アイコン
      v-icon portrait
    v-tab
      div 立ち絵
      v-icon person
    v-tab
      div.red--text 削除
      v-icon(color="red") delete
    v-tab-item
      character-basis-editor.mt-3(
        :character="character"
        :character-attribute-names="characterAttributeNames"
      )
    v-tab-item
      character-icon-editor.mt-3(:character="character")
    v-tab-item
      character-portrait-editor.mt-3(:character="character")
    v-tab-item
      character-deleting-form.mt-3(:character="character" @delete="deleteCharacter")
</template>

<script>
import CharacterBasisEditor from '@/browser/moleculers/CharacterBasisEditor.vue';
import CharacterDeletingForm from '@/browser/moleculers/CharacterDeletingForm.vue';
import CharacterIconEditor from '@/browser/moleculers/CharacterIconEditor.vue';
import CharacterPortraitEditor from '@/browser/moleculers/CharacterPortraitEditor.vue';

export default {
  components: {
    CharacterBasisEditor,
    CharacterIconEditor,
    CharacterPortraitEditor,
    CharacterDeletingForm,
  },
  data: () => ({
    tab: 0,
  }),
  methods: {
    deleteCharacter() {
      this.$models.characters.remove(this.roomId, this.character.id);
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
