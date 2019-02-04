<template lang="pug">
  div
    chat-palette-name-input(v-model="name")
    chat-palette-items-input(v-model="items")
</template>

<script>
import ChatPaletteItemsInput from '@/browser/atoms/ChatPaletteItemsInput.vue';
import ChatPaletteNameInput from '@/browser/atoms/ChatPaletteNameInput.vue';

function field(key) {
  return {
    get() {
      return this.value[key];
    },
    set(value) {
      this.$emit('input', {
        ...this.value,
        [key]: value,
      });
    },
  };
}

export default {
  components: {
    ChatPaletteNameInput,
    ChatPaletteItemsInput,
  },
  computed: {
    items: field('items'),
    name: field('name'),
  },
  props: {
    value: {
      required: true,
      type: Object,
    },
  },
};
</script>
