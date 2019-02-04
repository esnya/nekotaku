<template lang="pug">
  v-layout(column align-center)
    character-deleting-text(:character="character")
    delete-button(@click="$emit('delete', $event)")
</template>

<script>
import CharacterDeletingText from '@/browser/atoms/CharacterDeletingText.vue';
import DeleteButton from '@/browser/atoms/DeleteButton.vue';

export default {
  components: {
    CharacterDeletingText,
    DeleteButton,
  },
  props: {
    character: {
      required: true,
      type: Object,
    },
  },
};
</script>
