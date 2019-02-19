<template lang="pug">
  v-card-text
    chat-name-input(v-model="name")
    color-select.mb-2(v-model="color")
    delete-button(@delete="$emit('delete', $event)")
</template>

<script>
import ChatNameInput from '@/browser/atoms/ChatNameInput.vue';
import ColorSelect from '@/browser/atoms/ColorSelect.vue';
import DeleteButton from '@/browser/atoms/DeleteButton.vue';
import modelWrapper from '@/browser/mixins/modelWrapper';

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
  mixins: [modelWrapper(Object, true)],
  components: {
    ChatNameInput,
    ColorSelect,
    DeleteButton,
  },
  computed: {
    name: field('name'),
    color: field('color'),
  },
};
</script>
