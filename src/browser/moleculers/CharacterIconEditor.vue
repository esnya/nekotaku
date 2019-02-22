<template lang="pug">
  div
    v-layout
      v-spacer
      image-editor(
        :url="character.icon"
        @upload="upload"
        @clear="clear"
      )
      v-spacer
    character-icon-size-input(:value="character.iconSize" @input="updateIconSize($event)")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import CharacterIconSizeInput from '@/browser/atoms/CharacterIconSizeInput.vue';
import CharactersDAO from '@/browser/dao/CharactersDAO';
import ImageEditor from '@/browser/moleculers/ImageEditor.vue';
import Character from '@/models/Character';
import Room from '@/models/Room';

const charactersDAO = new CharactersDAO();

@Component({
  components: {
    ImageEditor,
    CharacterIconSizeInput,
  },
})
export default class CharacterIconEditor extends Vue {
  @Prop({ required: true }) character!: Character;

  upload(file: File): void {
    const {
      roomId,
      character,
    } = this as any;
    (this as any).$models.characters.updateIcon(roomId, character.id, file);
  }

  updateIconSize(iconSize: number | null): void {
    if (!iconSize || iconSize < 0) return;

    const {
      character,
    } = this;

    charactersDAO.updateItem(character.id, { iconSize });
  }

  clear(): void {
    const {
      roomId,
      character,
    } = this as any;

    (this as any).$models.characters.removeIcon(roomId, character.id);
  }
}
</script>
