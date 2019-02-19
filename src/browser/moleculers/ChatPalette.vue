<template lang="pug">
  div
    chat-palette-form(:value="chatPalette" @input="$emit('update', $event)" v-if="editMode")
    chat-palette-item-list(:chat-palette="chatPalette" @close="$emit('close')" v-else)
    edit-finish-button(@click="updateEditMode(false)" v-if="editMode")
    edit-button(@click="updateEditMode(true)" v-else)
    delete-button(@click="$emit('delete')")
</template>

<script>
import ChatPaletteForm from '@/browser/moleculers/ChatPaletteForm.vue';
import ChatPaletteItemList from '@/browser/moleculers/ChatPaletteItemList.vue';
import DeleteButton from '@/browser/atoms/DeleteButton.vue';
import EditButton from '@/browser/atoms/EditButton.vue';
import EditFinishButton from '@/browser/atoms/EditFinishButton.vue';

export default {
  components: {
    ChatPaletteForm,
    ChatPaletteItemList,
    DeleteButton,
    EditButton,
    EditFinishButton,
  },
  data: () => ({
    editMode: false,
  }),
  methods: {
    updateEditMode(value) {
      setTimeout(() => {
        this.editMode = value;
      });
    },
  },
  props: {
    chatPalette: {
      required: true,
      type: Object,
    },
  },
};
</script>
