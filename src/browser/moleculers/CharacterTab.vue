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
import FixedBottomRight from '@/browser/atoms/FixedBottomRight.vue';
import CharacterTable from '@/browser/moleculers/CharacterTable.vue';
import CharacterAddingDialog from '@/browser/moleculers/CharacterAddingDialog.vue';
import { bindAsList } from '@/browser/models';

export default {
  mixins: [
    bindAsList('characters'),
  ],
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
    room: {
      required: true,
      type: Object,
    },
  },
};
</script>
