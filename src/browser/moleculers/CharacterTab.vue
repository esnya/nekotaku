<template lang="pug">
  div
    character-table(
      :characters="characters"
      :character-attribute-names="room.characterAttributes || []"
    )
    fixed-bottom-right
      add-fab(@click="addingDialog = true")
    character-adding-dialog(v-model="addingDialog")
</template>

<script>
import AddFab from '@/browser/atoms/AddFab.vue';
import CharacterAddingDialog from '@/browser/moleculers/CharacterAddingDialog.vue';
import CharacterTable from '@/browser/moleculers/CharacterTable.vue';
import FixedBottomRight from '@/browser/atoms/FixedBottomRight.vue';

export default {
  components: {
    AddFab,
    CharacterAddingDialog,
    CharacterTable,
    FixedBottomRight,
  },
  data: () => ({
    addingDialog: false,
  }),
  props: {
    characters: {
      required: true,
      type: Array,
    },
    room: {
      required: true,
      type: Object,
    },
  },
};
</script>
